import React, { createRef } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    AppState,
    InteractionManager,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Spinner from 'react-native-loading-spinner-overlay';
import messaging from '@react-native-firebase/messaging';
import { withMainContext, SORT_TYPE } from '../../context';

import { connect } from 'react-redux';
import { request as getListByClubIdRequest } from '../../actions/club/getListByClubId';
import { request as getUsersRequest } from '../../actions/user/getUsers';
import { request as updateUserRequest } from '../../actions/auth/update';
import { requestSuccess as updateViewerSucessRequest } from '../../actions/viewer/updateViewer';
import { request as getClubByUserRequest } from '../../actions/club/getClubByUserId';
import { request as getViewerByAssembleRequest } from '../../actions/viewer/getViewerByAssemble';
import { request as connectClubRequest } from '../../actions/club/connectClub';
import { update as currentClubUpdateRequest } from '../../actions/club/currentClub';

import styles from './styles';
import Navigation from '../../routers/navigation';
import {
    HomeContainer,
    AssembleCard,
    VoiceCard,
    AudioCard,
    EventCard,
    SanityModal,
    ClubHeader,
    EmptyContent,
    FooterContent,
    ActionBtns,
} from '../../components/index';
import {
    createSocketClient,
    subscribeTopic,
    assembleIsLive,
    showFlashMsg,
} from '../../helpers/utils';
import { initRtcEngine, leaveChannel } from '../../helpers/agoraUtil';
import RNCallKeep from 'react-native-callkeep';
import VoipPushNotification from '../../components/nativeVoIPModule';
import EndRoomModal from '../Assembly/endRoomModal';
import EndAudioModal from '../Audio/endAudioModal';
import { setupPlayer } from '../../services/setupPlayer';
import MinizeCall from './minimizeCall';
import MinizePlayer from './minimizePlayer';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

import { getSortedData, isValidStart, setUpCallKit, initAgora } from './utils';
import MessageScreen from '../MessageScreen';

const ENDPOINTS = APIConfig.apiEndpoints;

const wsOpen = userId => {
    subscribeTopic('viewer/update');
    subscribeTopic('viewer/create');
    subscribeTopic('viewer/delete');
    subscribeTopic(`invite/voicenote/${userId}`);
    subscribeTopic(`invite/audio/${userId}`);
    subscribeTopic(`update/audio/${userId}`);
    subscribeTopic(`delete/audio/${userId}`);
    subscribeTopic('reorder/audio');
    subscribeTopic(`invite/assembly/${userId}`);
    subscribeTopic(`update/assembly/${userId}`);
    subscribeTopic(`delete/assembly/${userId}`);
    subscribeTopic(`end/assembly/${userId}`);
    subscribeTopic(`invite/event/${userId}`);
    subscribeTopic(`update/event/${userId}`);
    subscribeTopic(`delete/event/${userId}`);
    subscribeTopic(`end/event/${userId}`);
    subscribeTopic('reorder/assembly');
    subscribeTopic('like/user');
    subscribeTopic('presence/user');
};

class Home extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
    };

    // assembleListRef: FlatList;
    // endRoomModalRef: EndRoomModal;
    // endAudioModalRef: EndAudioModal;

    constructor(props) {
        super(props);
        this.state = {
            listData: null,
            isConnected: false,
            showInviteModal: false,
            showInviteMsg: '',
            showInviteType: '',
            refreshing: false,
            appState: AppState.currentState,
            currentTime: 0,
            loading: false,
            bottomHeight: 0,
        };
        this.assembleListRef = createRef();
        this.assembleItemRef = createRef();
        this.endRoomModalRef = createRef();
        this.endAudioModalRef = createRef();
        this.eventListRef = createRef();
        this.eventItemRef = createRef();
        setUpCallKit();
    }

    async componentDidMount() {
        setupPlayer();
        this.handleGetList();
        this.props.getClubByUserRequest({
            id: global.currentUser.user_id,
        });
        createSocketClient();
        initAgora();
        this.initFirebaseMessage();
        this.refreshFirebaseMessage();
        AppState.addEventListener('change', this.handleAppStateChange);

        NetInfo.addEventListener(state => {
            console.log('@@@@@ state: ', state.isConnected, state.isInternetReachable);
            if (typeof state.isInternetReachable === 'boolean') {
                const offline = !(
                    state.isConnected && state.isInternetReachable
                );
                if (offline) {
                    showFlashMsg(
                        'Looks like your Internet connection is unstable.'
                    );
                }
            }
        });

        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.setParams({
                scrollToTop: this.handleGetList,
            });
        });

        setInterval(() => {
            this.setState({
                currentTime: new Date().getTime(),
            });
        }, 1000 * 20);

        this.handleRegisterVoIPNotification();
        this.handleRegisterCallKit();
    }

    async componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.handleRemoveVoIPNotification();
        this.handleRemoveCallKit();
    }

    componentDidUpdate(prevProps) {
        const {
            error,
            socket,
            inviteAssemblyData,
            inviteAudioData,
            inviteEventData,
            inviteVoicenoteData,
            listData,
            club,
            createAssembleData,
            userClubs,
        } = this.props;

        if (socket.connected && socket.connected != prevProps.socket.connected) {
            this.setState({
                isConnected: true,
            });
            const userId = global.currentUser.user_id;
            wsOpen(userId);
        }

        if (listData && listData !== prevProps.listData) {
            this.setState({
                listData,
            });
        }

        if (error && error !== prevProps.error) {
        }

        if (club !== prevProps.club) {
            if (club) {
                this.handleGetList();
            } else {
                this.setState({
                    listData: [],
                });
            }
        }

        if (inviteAssemblyData && inviteAssemblyData !== prevProps.inviteAssemblyData) {
            if (!this.state.showInviteModal) {
                this.handleInviteModal(
                    inviteAssemblyData.message,
                    SORT_TYPE.assemble_live
                );
            }
        }

        if (inviteAudioData && inviteAudioData !== prevProps.inviteAudioData) {
            if (!this.state.showInviteModal) {
                this.handleInviteModal(
                    inviteAudioData.message,
                    SORT_TYPE.audios
                );
            }
        }

        if (inviteEventData && inviteEventData !== prevProps.inviteEventData) {
            if (!this.state.showInviteModal) {
                this.handleInviteModal(
                    inviteEventData.message,
                    SORT_TYPE.events
                );
            }
        }

        if (inviteVoicenoteData && inviteVoicenoteData !== prevProps.inviteVoicenoteData) {
            if (!this.state.showInviteModal) {
                this.handleInviteModal(
                    inviteVoicenoteData.message,
                    SORT_TYPE.voicenotes
                );
            }
        }

        if (createAssembleData && createAssembleData !== prevProps.createAssembleData) {
            console.log('@@@@@Here4: ', typeof isValidStart(createAssembleData), isValidStart(createAssembleData));
            if (isValidStart(createAssembleData)) {
                this._checkCurrentSession(() => {
                    this.onCreateViewer(createAssembleData);
                });
            }
        }

        if (userClubs && userClubs !== prevProps.userClubs) {
            if (Array.isArray(userClubs) && userClubs.length < 1) {
                Navigation.navigate('JoinClubModal');
            }
        }
    }

    handleRegisterCallKit = () => {
        RNCallKeep.addEventListener('answerCall', data => {
            console.log('@@@@@answerCall: ', data);
            const { callUUID } = data;
            RNCallKeep.endCall(callUUID);
            this.handleAnswerFromVoip(callUUID);
        });
    };

    handleRemoveCallKit = () => {
        RNCallKeep.removeEventListener('answerCall');
    };

    handleRegisterVoIPNotification = () => {
        VoipPushNotification.registerVoipToken();
        VoipPushNotification.addEventListener('didLoadWithEvents', events => {
            if (!events || !Array.isArray(events) || events.length < 1) {
                return;
            }
            for (let voipPushEvent of events) {
                let { name, data } = voipPushEvent;
                if (
                    name ===
                    VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent
                ) {
                    this.props.updateUserRequest({
                        call_token: data,
                    });
                } else if (
                    name ===
                    VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
                ) {
                }
            }
        });

        // --- onVoipPushNotificationRegistered
        VoipPushNotification.addEventListener('register', token => {
            // --- send token to your apn provider server
            this.props.updateUserRequest({
                call_token: token,
            });
        });

        // --- onVoipPushNotificationiReceived
        VoipPushNotification.addEventListener('notification', notification => {
            VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
        });
    };

    handleRemoveVoIPNotification = () => {
        VoipPushNotification.removeEventListener('didLoadWithEvents');
        VoipPushNotification.removeEventListener('register');
        VoipPushNotification.removeEventListener('notification');
    };

    handleGetList = () => {
        if (this.props.club) {
            this.props.getListByClubIdRequest({
                id: this.props.club.club_id,
            });
        }
        this._scrollToTop();
    };

    handleAppStateChange = nextAppState => {
        const { appState } = this.state;
        const { currentViewer } = this.props.context;
        if (
            appState.match(/active|foreground/) &&
            nextAppState === 'background'
        ) {
            if (currentViewer && !currentViewer.viewer_id) {
                leaveChannel();
            }
        }
    };

    initFirebaseMessage = () => {
        messaging()
            .getToken()
            .then(token => {
                this.props.updateUserRequest({
                    fcm_token: token,
                });
            });
    };

    refreshFirebaseMessage = () => {
        messaging().onTokenRefresh(token => {
            this.props.updateUserRequest({
                fcm_token: token,
            });
        });
    };

    onRefresh = () => {
        this.setState({ refreshing: true });
        if (this.props.club) {
            this.props.getListByClubIdRequest({
                id: this.props.club.club_id,
            });
        }
        this.props.getClubByUserRequest({
            id: global.currentUser.user_id,
        });
        setTimeout(() => {
            this.setState({ refreshing: false });
        }, 1500);
    };

    handleAnswerFromVoip = async assemble_id => {
        try {
            this.setState({ loading: true });
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getAssemble(assemble_id),
            });
            this.setState({ loading: false });
            if (data.status && isValidStart(data.data)) {
                this._checkCurrentSession(() => {
                    this.onCreateViewer(data.data);
                });
            } else {
                // showFlashMsg('Unable to join room. Please try again', true);
            }
        } catch (error) {
            this.setState({ loading: false });
            // showFlashMsg('Unable to join room. Please try again', true);
        }
    };

    onCreateViewer = async item => {
        try {
            const {
                currentViewer,
                currentRoom,
                updateCurrentViewer,
                updateCurrentRoom,
            } = this.props.context;
            if (item && item.assemble_id) {
                this.setState({ loading: true });
                const currentUser = global.currentUser;
                const payload = {
                    channel_id: item.assemble_id,
                    first_name: currentUser.first_name,
                    last_name: currentUser.last_name,
                    photo_url: currentUser.photo_url,
                    handup: item.is_enter_stage,
                    handselect: item.is_enter_stage,
                };
                const { data } = await axiosAjax({
                    method: 'post',
                    url: ENDPOINTS.createViewer(),
                    data: normailzeQSData(payload),
                });
                this.props.getViewerByAssembleRequest({
                    id: item.assemble_id,
                });
                this.setState({ loading: false });
                if (data.error) {
                    showFlashMsg('Unable to join room. Please try again', true);
                } else {
                    updateCurrentRoom(item);
                    console.log('createdViewer: ', data.data);
                    updateCurrentViewer(data.data);
                    this.props.navigation.navigate('Assembly', {
                        startCall: true,
                    });
                }
            } else {
                showFlashMsg('Unable to join room. Please try again', true);
            }
        } catch (error) {
            this.setState({ loading: false });
        }
    };

    onSwitchClub = (item, type) => {
        this.props.connectClubRequest({
            club_id: item.club_id,
        });
        this.props.currentClubUpdateRequest(item);
        this.props.getListByClubIdRequest({ id: item.club_id });
        this.props.context.toggleSortType(type);
    };

    onGotoInviteItem = () => {
        const {
            inviteAssemblyData,
            inviteAudioData,
            inviteVoicenoteData,
            club,
            userClubs,
        } = this.props;
        const { listData, showInviteType } = this.state;
        if (showInviteType === SORT_TYPE.assemble_live) {
            if (inviteAssemblyData && inviteAssemblyData.data) {
                const sortedData = getSortedData(
                    SORT_TYPE.assemble_all,
                    listData,
                    club
                );
                if (
                    club &&
                    inviteAssemblyData.data.enter_club_id === club.club_id
                ) {
                    const assembleIdx = sortedData.findIndex(
                        r =>
                            r.assemble_id ===
                            inviteAssemblyData.data.assemble_id
                    );
                    console.log('@@@@@inviteAssemblyData: ', isValidStart(inviteAssemblyData.data));
                    if (isValidStart(inviteAssemblyData.data)) {
                        this._checkCurrentSession(() => {
                            this.onCreateViewer(inviteAssemblyData.data);
                        });
                    } else if (this.assembleListRef && this.assembleListRef.current) {
                        const scrollIndex = assembleIdx == -1 ? 0 : assembleIdx;
                        this.assembleListRef.current.scrollToIndex({
                            animated: true,
                            index:
                                scrollIndex < sortedData.length
                                    ? scrollIndex
                                    : 0,
                        });
                    }
                } else {
                    if (userClubs && userClubs.length > 0) {
                        const otherClub = userClubs.find(
                            a =>
                                a.club_id ===
                                inviteAssemblyData.data.enter_club_id
                        );
                        if (otherClub) {
                            this._checkCurrentSession(() => {
                                this.onSwitchClub(
                                    otherClub,
                                    SORT_TYPE.assemble_all
                                );
                                console.log('@@@@@inviteAssemblyData1: ', isValidStart(inviteAssemblyData.data));
                                if (isValidStart(inviteAssemblyData.data)) {
                                    this.onCreateViewer(
                                        inviteAssemblyData.data
                                    );
                                }
                            });
                        }
                    }
                }
            }
        } else if (showInviteType === SORT_TYPE.audios) {
            if (inviteAudioData && inviteAudioData.data) {
                const sortedData = getSortedData(
                    SORT_TYPE.audios,
                    listData,
                    club
                );
                if (
                    club &&
                    inviteAudioData.data.enter_club_id === club.club_id
                ) {
                    const audioIdx = sortedData.findIndex(
                        r => r.audio_id === inviteAudioData.data.audio_id
                    );
                    const scrollIndex = audioIdx == -1 ? 0 : audioIdx;
                    if (this.assembleListRef && this.assembleListRef.current) {
                        this.assembleListRef.current.scrollToIndex({
                            animated: true,
                            index:
                                scrollIndex < sortedData.length
                                    ? scrollIndex
                                    : 0,
                        });
                    }
                } else {
                    if (userClubs && userClubs.length > 0) {
                        const otherClub = userClubs.find(
                            a =>
                                a.club_id === inviteAudioData.data.enter_club_id
                        );
                        if (otherClub) {
                            this._checkCurrentSession(() => {
                                this.onSwitchClub(otherClub, SORT_TYPE.audios);
                            });
                        }
                    }
                }
            }
        } else if (showInviteType === SORT_TYPE.voicenotes) {
            if (inviteVoicenoteData && inviteVoicenoteData.data) {
                const sortedData = getSortedData(
                    SORT_TYPE.voicenotes,
                    listData,
                    club
                );
                if (
                    club &&
                    inviteVoicenoteData.data.enter_club_id === club.club_id
                ) {
                    const voicenoteIdx = sortedData.findIndex(
                        r =>
                            r.voicenote_id ===
                            inviteVoicenoteData.data.voicenote_id
                    );
                    const scrollIndex = voicenoteIdx == -1 ? 0 : voicenoteIdx;
                    if (this.assembleListRef && this.assembleListRef.current) {
                        this.assembleListRef.current.scrollToIndex({
                            animated: true,
                            index:
                                scrollIndex < sortedData.length
                                    ? scrollIndex
                                    : 0,
                        });
                    }
                } else {
                    if (userClubs && userClubs.length > 0) {
                        const otherClub = userClubs.find(
                            a =>
                                a.club_id ===
                                inviteVoicenoteData.data.enter_club_id
                        );
                        if (otherClub) {
                            this._checkCurrentSession(() => {
                                this.onSwitchClub(
                                    otherClub,
                                    SORT_TYPE.voicenotes
                                );
                            });
                        }
                    }
                }
            }
        }
    };

    dismissModals = () => {
        this.setState({
            showInviteModal: false,
        });
    };

    handleInviteModal = (msg, type) => {
        this.setState({
            showInviteModal: !this.state.showInviteModal,
            showInviteMsg: msg,
            showInviteType: type,
        });
    };

    _scrollToTop = () => {
        if (this.assembleListRef && this.assembleListRef.current) {
            this.assembleListRef.current.scrollToOffset({
                animated: true,
                offset: 0,
            });
        }
        if (this.eventListRef && this.eventListRef.current) {
            this.eventListRef.current.scrollToOffset({
                animated: true,
                offset: 0,
            });
        }
    };

    _checkCurrentSession = (callBack = () => { }, showModal = true) => {
        const { currentRoom, currentAudio } = this.props.context;
        if (currentRoom) {
            this._showEndRoomModal(callBack);
            return;
        } else if (currentAudio) {
            this._showEndAudioModal(callBack);
            return;
        }
        callBack();
    };

    _showEndRoomModal = (callBack = () => { }) => {
        const { currentRoom } = this.props.context;
        const { fetched } = this.props;
        const { loading } = this.state;
        if (!currentRoom) {
            callBack();
            return;
        }
        if (
            this.endRoomModalRef &&
            this.endRoomModalRef.current &&
            !fetched &&
            !loading
        ) {
            this.endRoomModalRef.current.show(callBack);
        }
    };

    _showEndAudioModal = (callBack = () => { }) => {
        const { currentAudio } = this.props.context;
        const { fetched } = this.props;
        const { loading } = this.state;
        if (!currentAudio) {
            callBack();
            return;
        }
        if (
            this.endAudioModalRef &&
            this.endAudioModalRef.current &&
            !fetched &&
            !loading
        ) {
            this.endAudioModalRef.current.show(callBack);
        }
    };

    _keyExtractor = item =>
        item.assemble_id
            ? item.assemble_id
            : item.audio_id
                ? item.audio_id
                : item.voicenote_id
                    ? item.voicenote_id
                    : item.event_id
                        ? item.event_id
                        : '';

    getItemLayout = (data, index) => ({
        length: 500,
        offset: 500 * index,
        index,
    });

    renderItem = ({ item, index }) => {
        const { club } = this.props;
        if (item.audio_id && item.audio_id !== '' && (!item.audio_status || item.audio_status === 'approved')) {
            return (
                <AudioCard
                    item={item}
                    club={club}
                    onRefresh={() => {
                        if (this.props.club) {
                            this.props.getListByClubIdRequest({
                                id: this.props.club.club_id,
                            });
                        }
                    }}
                    onEndAudio={this._showEndAudioModal}
                    onEndRoom={this._showEndRoomModal}
                />
            );
        }

        if (item.assemble_id && item.assemble_id !== '') {
            return (
                <AssembleCard
                    innerRef={this.assembleItemRef}
                    key={item.assemble_id}
                    item={item}
                    club={club}
                    navigation={this.props.navigation}
                    onRefresh={() => {
                        if (this.props.club) {
                            this.props.getListByClubIdRequest({
                                id: this.props.club.club_id,
                            });
                        }
                    }}
                    onEndRoom={this._showEndRoomModal}
                    onEndAudio={this._showEndAudioModal}
                    currentTime={this.state.currentTime}
                />
            );
        }

        if (item.event_id && item.event_id !== '') {
            return (
                <EventCard
                    key={item.event_id}
                    item={item}
                    club={club}
                    navigation={this.props.navigation}
                    onRefresh={() => {
                        if (this.props.club) {
                            this.props.getListByClubIdRequest({
                                id: this.props.club.club_id,
                            });
                        }
                    }}
                />
            );
        }

        if (item.voicenote_id && item.voicenote_id !== '') {
            return (
                <VoiceCard
                    item={item}
                    club={club}
                    onRefresh={() => {
                        if (this.props.club) {
                            this.props.getListByClubIdRequest({
                                id: this.props.club.club_id,
                            });
                        }
                    }}
                    onEndAudio={this._showEndAudioModal}
                    onEndRoom={this._showEndRoomModal}
                />
            );
        }
        return null;
    };

    renderHeader = () => {
        const { club } = this.props;
        if (club) {
            return <ClubHeader club={club} />;
        }
        return null;
    };

    handleEmptyPress = sortType => {
        const { allRoom, allAudio, updateCurrentAudio } = this.props.context;
        if (sortType === SORT_TYPE.audios) {
        } else if (sortType === SORT_TYPE.voicenotes) {
            Navigation.navigate('UserSelectorScreen');
        } else if (sortType === SORT_TYPE.events) {

        } else {
            Navigation.navigate('StartAssemlbyModal');
        }
    };

    renderEmpty = sortType => {
        let iconName = 'plus';
        let description =
            'There are no Rooms right now, try starting your own!';
        if (sortType === SORT_TYPE.audios) {
            iconName = 'podcast';
            description =
                'There is no media for your Club right now, check back later!';
        } else if (sortType === SORT_TYPE.voicenotes) {
            iconName = 'users';
            description =
                'You have no messages right now. Try sending a message to another Club Member to get a conversation started!';
        } else if (sortType === SORT_TYPE.events) {
            iconName = 'users';
            description =
                'You have no events right now. Please check back later!';
        }
        if (this.state.listData == null) {
            return null;
        }
        return (
            <EmptyContent
                sortType={sortType}
                iconName={iconName}
                description={description}
                contentStyle={{ flexDirection: 'row' }}
                onPress={this.handleEmptyPress}
            />
        );
    };

    renderFooter = sortType => {
        let iconName = 'plus-circle';
        let description =
            'That’s all the Rooms that there are right now, try starting your own!';
        if (sortType === SORT_TYPE.audios) {
            iconName = 'podcast';
            description =
                'That\'s all the audio in your Club right now, check back later for updates!';
        } else if (sortType === SORT_TYPE.voicenotes) {
            iconName = 'users';
            description =
                'That’s all of your messages for now.  Try sending a VoiceNote to another Club Member to keep in touch!';
        } else if (sortType === SORT_TYPE.events) {
            iconName = 'podcast';
            description =
                'That’s all of your events for now. Please check back later.';
        }
        if (this.state.listData == null) {
            return null;
        }
        return (
            <FooterContent
                sortType={sortType}
                iconName={iconName}
                description={description}
                contentStyle={{ flexDirection: 'row' }}
                onPress={this.handleEmptyPress}
            />
        );
    };

    render() {
        const sortType = this.props.context.sortType;
        const toggleSortType = this.props.context.toggleSortType;
        return this.renderMain(sortType, toggleSortType);
    }

    renderMain(sortType, toggleSortType) {
        if (!global.currentUser || !global.currentUser.user_id) {
            return null;
        }
        const {
            club,
            context,
        } = this.props;
        const { allRoom, allAudio, allEvent } = context;
        const {
            showInviteModal,
            showInviteMsg,
            refreshing,
            listData,
        } = this.state;
        const flatData = getSortedData(sortType, listData, club);

        let fetching = this.props.fetched;
        if (listData && listData.length > 0) {
            fetching = false;
        }
        return (
            <HomeContainer
                sortType={sortType}
                toggleSortType={toggleSortType}
                isHome={true}
            >
                <SanityModal
                    show={showInviteModal}
                    msg={showInviteMsg}
                    cancelText={`I'll stay`}
                    hasClose={false}
                    confirmText={'OK'}
                    onCancel={this.dismissModals}
                    onConfirm={() => {
                        this.dismissModals();
                        setTimeout(() => {
                            this.onGotoInviteItem();
                        }, 500);
                    }}
                />
                <Spinner visible={fetching} />
                <View style={styles.assembleContainer}>
                    {sortType !== SORT_TYPE.voicenotes && (
                        <FlatList
                            // ref={this.assembleListRef}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingBottom:
                                    allRoom || allAudio || allEvent
                                        ? this.state.bottomHeight
                                        : 0,
                            }}
                            refreshControl={
                                <RefreshControl
                                    colors={['#9Bd35A', '#689F38']}
                                    refreshing={refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            }
                            getItemLayout={this.getItemLayout}
                            keyExtractor={this._keyExtractor}
                            data={flatData}
                            extraData={this.props}
                            ListEmptyComponent={this.renderEmpty(sortType)}
                            ListHeaderComponent={this.renderHeader}
                            ListFooterComponent={
                                flatData.length > 0
                                    ? this.renderFooter(sortType)
                                    : null
                            }
                            renderItem={this.renderItem}
                        />
                    )}
                    {sortType === SORT_TYPE.voicenotes && (
                        <>
                            {this.renderHeader()}
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <MessageScreen />
                                </View>
                            </View>
                        </>
                    )}
                    <ActionBtns toggleSortType={toggleSortType} />
                </View>
                <MinizeCall
                    onChangeBottomHeight={height => {
                        this.setState({
                            bottomHeight: height,
                        });
                    }}
                />
                <MinizePlayer
                    onChangeBottomHeight={height => {
                        this.setState({
                            bottomHeight: height,
                        });
                    }}
                />
                <EndRoomModal ref={this.endRoomModalRef} />
                <EndAudioModal ref={this.endAudioModalRef} />
            </HomeContainer>
        );
    }
}

const mapStateToProps = state => {
    const userId = global.currentUser ? global.currentUser.user_id : '';
    const inviteAssemblyData = state.inviteAssemble.data;
    const inviteAudioData = state.inviteAudio.data;
    const inviteEventData = state.inviteEvent.data;
    const inviteVoicenoteData = state.inviteVoicenote.data;
    const club = state.currentClub.data;
    const club_id = club ? club.club_id : '';
    let fetched = true;
    var listData = null;
    var listGETData = state.listGET[club_id];
    if (listGETData && listGETData.data) {
        listData = listGETData.data;
        fetched = listGETData.loading;
    }
    var error = null;
    if (listGETData && listGETData.error) {
        error = listGETData.error;
    }

    const userClubData = state.clubsByUserGET[userId];
    const userClubs = userClubData ? userClubData.data : [];

    return {
        club,
        listData,
        error,
        fetched,
        socket: state.socket,
        inviteAssemblyData,
        inviteAudioData,
        inviteEventData,
        inviteVoicenoteData,
        createAssembleData: state.assemblePOST.data
            ? state.assemblePOST.data.data
            : null,
        userClubs,
    };
};

const mapDispatchToProps = {
    getClubByUserRequest,
    getListByClubIdRequest,
    getUsersRequest,
    updateUserRequest,
    updateViewerSucessRequest,
    getViewerByAssembleRequest,
    connectClubRequest,
    currentClubUpdateRequest,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withMainContext(Home));
