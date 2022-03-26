import React from 'react';
import {
    View,
    Text,
    FlatList,
    SectionList,
} from 'react-native';
import RtcEngine from 'react-native-agora';

import { connect } from 'react-redux';
import { request as getViewerByAssembleRequest } from '../../actions/viewer/getViewerByAssemble';
import { request as updateViewerRequest } from '../../actions/viewer/updateViewer';

import Navigation from '../../routers/navigation';

import { withMainContext } from '../../context';
import styles from './styles';
import { HomeContainer, AudienceCard, StageCard } from '../../components/index';
import { parseJSONorNot, showFlashMsg } from '../../helpers/utils';
import {
    getUnSingedInt,
    joinChannel,
} from '../../helpers/agoraUtil';
import axiosAjax from '../../api/axiosConf';
import APIConfig from '../../api/const';

import TopActions from './topActions';
import BottomActions from './bottomActions';

class Assembly extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
    };

    constructor(props) {
        super(props);
        this.state = {
            viewers: [],
            viewerSpeakers: [],
            likeUsers: [],
            stage_viewers: [],
            list_viewers: [],
            sections: []
        };
    }

    async componentDidMount() {
        const { currentRoom } = this.props.context;
        const { startCall } = this.props.navigation.state.params;
        const roomId = currentRoom.assemble_id;
        this.props.getViewerByAssembleRequest({
            id: roomId,
        });
        if (startCall) {
            this.onStartCall(roomId);
        }
        await this.onAddRtcListeners();
        this.startLikeTimer();
    }

    componentDidUpdate(prevProps, prevState) {
        const { viewers, likeUser } = this.props;
        const { currentViewer, updateCurrentViewer } = this.props.context;
        const { likeUsers } = this.state;
        if (viewers !== prevProps.viewers) {
            if (
                viewers &&
                Array.isArray(viewers) &&
                viewers.length > 0 &&
                currentViewer
            ) {
                const cur_viewer = viewers.find(
                    a => a.viewer_id === currentViewer.viewer_id
                );
                if (cur_viewer && cur_viewer.viewer_id !== '') {
                    if (currentViewer !== cur_viewer) {
                        updateCurrentViewer(cur_viewer);
                    }
                }
            }
            this.setState({ viewers });
        }

        if (likeUser && likeUser !== prevProps.likeUser) {
            const findIndex = likeUsers.findIndex(l => l === likeUser);
            console.log('@@@@@ like user add', findIndex, likeUser, this.state.likeUsers);
            if (findIndex === -1 && likeUser.count > 0) {
                this.setState({
                    likeUsers: [...likeUsers, likeUser],
                });
            }
        }
    }

    componentWillUnmount() {
        this.stopLikeTimer();
        RtcEngine.instance().removeAllListeners();
    }

    onStartCall = async channel_id => {
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: `agora/${channel_id}`,
            });
            const { token, uid } = data;
            console.log('@@@@@ start call', token, channel_id, uid, getUnSingedInt(uid));
            await joinChannel(token, channel_id, getUnSingedInt(uid));
        } catch (error) {
            console.error('@@@@@ onStartCall Error: ', error);
            showFlashMsg('Error starting room - Please try again', true);
        }
    };

    onAddRtcListeners = async () => {
        const user_id = global.currentUser.user_id;
        const { currentViewer, updateCurrentViewer, currentRoom } = this.props.context;
        RtcEngine.instance().addListener(
            'JoinChannelSuccess',
            (channel, uid, elapsed) => {
                const unsignedUid = getUnSingedInt(uid);
                console.warn(
                    'JoinChannelSuccess',
                    channel,
                    unsignedUid,
                    elapsed
                );
                let newCurrentViewer = { ...currentViewer };
                newCurrentViewer.agora_uid = `${unsignedUid}`;
                let isHost = false;
                if (currentRoom) {
                    if (currentViewer.user_id === currentRoom.user_id) {
                        isHost = true;
                    }
                }
                if (!isHost) {
                    newCurrentViewer.muted = currentViewer.handup ? false : true;
                }
                updateCurrentViewer(newCurrentViewer);
                this.props.updateViewerRequest({
                    id: user_id,
                    agora_uid: `${unsignedUid}`,
                    muted: newCurrentViewer.muted
                });

            }
        );

        RtcEngine.instance().addListener(
            'LeaveChannel',
            (channel, uid, elapsed) => {
                const unsignedUid = getUnSingedInt(uid);
                console.warn('LeaveChannelSuccess', channel, unsignedUid);
            }
        );

        RtcEngine.instance().addListener('UserJoined', (uid, elapsed) => {
            const unsignedUid = getUnSingedInt(uid);
            console.log('@@@@@ UserJoined', unsignedUid, elapsed);
        });

        RtcEngine.instance().addListener(
            'AudioVolumeIndication',
            (speakers, totalVolume) => {
                const { currentViewer } = this.props.context;
                if (totalVolume > 0) {
                    const { viewerSpeakers } = this.state;
                    var newSpeakers = viewerSpeakers;
                    var addSpeakers = [];
                    if (newSpeakers.length > 0) {
                        for (const idx in speakers) {
                            const speaker = speakers[idx];
                            if (speaker.uid === 0) {
                                speaker['uid'] = currentViewer?.agora_uid;
                            }
                            const spIdx = newSpeakers.findIndex(
                                q =>
                                    getUnSingedInt(q.uid) ===
                                    getUnSingedInt(speaker.uid)
                            );
                            if (spIdx < 0) {
                                addSpeakers.push(speaker);
                            } else {
                                newSpeakers[spIdx] = speakers[idx];
                            }
                        }
                    } else {
                        addSpeakers = [...addSpeakers, ...speakers];
                    }
                    this.setState({
                        viewerSpeakers: [...newSpeakers, ...addSpeakers],
                    });
                }
            }
        );
        RtcEngine.instance().addListener('Warning', err => {
            const error = JSON.stringify(err);
            if (error.includes('110')) {
                showFlashMsg('Unable to join Room. Please join again', true);
            }
            console.warn('RTC Warning', JSON.stringify(err));
        });
        RtcEngine.instance().addListener('Error', err => {
            const error = JSON.stringify(err);
            if (error.includes('110')) {
                showFlashMsg('Unable to join Room. Please join again', true);
            }
            console.warn('RTC Error', JSON.stringify(err));
        });
    };

    startLikeTimer = () => {
        if (this.liketimer) {
            return;
        }
        this.liketimer = setInterval(() => {
            const { likeUsers } = this.state;
            if (likeUsers.length > 0) {
                const newLikeUsers = [];
                for (const idx in likeUsers) {
                    const likeUser = likeUsers[idx];
                    if (likeUser.created_at > new Date().getTime() - 2 * 1000) {
                        newLikeUsers.push(likeUser);
                    }
                }
                this.setState({
                    likeUsers: newLikeUsers,
                });
            }
        }, 1000);
    };

    stopLikeTimer = () => {
        clearInterval(this.liketimer);
        this.liketimer = 0;
    };
    /// Host function
    onHandSelectViewer = viewer => {
        if (viewer && viewer.viewer_id) {
            console.log('viewer111: ', viewer);
            const mute = viewer.is_audience ? !viewer.muted : viewer.is_stage ? viewer.host_allow ? viewer.muted : !viewer.muted : !viewer.muted
            this.props.updateViewerRequest({
                id: viewer.viewer_id,
                handup: false,
                handselect: !viewer.handselect,
                muted: mute
            });
        }
    };

    goMemberInfoModal = userItem => {
        Navigation.navigate('MemberInfoModal', {
            user: userItem,
            hideVoiceNote: true,
        });
    };

    onSwitchAllContent = () => {
        this.props.context.updateRoomStatus(true);
        Navigation.setNavParam('Home', { isHideTab: true });
        Navigation.back();
    };

    _keyExtractor = item => item.viewer_id;

    renderItem = ({ item, index }) => {
        const { allowHostTab, currentRoom } = this.props.context;
        const { viewerSpeakers, likeUsers } = this.state;
        const isLiked = likeUsers.find(l => item.user_id === l.user_id)
            ? true
            : false;
        if (item.is_stage) {
            return (
                <StageCard
                    viewerSpeakers={viewerSpeakers}
                    item={item}
                    isLiked={isLiked}
                    assemble={currentRoom}
                    navigation={this.props.navigation}
                    onPress={() => {
                        if (allowHostTab) {
                            this.onHandSelectViewer(item);
                        } else {
                            this.goMemberInfoModal(item);
                        }
                    }}
                />
            );
        } else if (item.is_audience) {
            return (
                <AudienceCard
                    item={item}
                    isLiked={isLiked}
                    navigation={this.props.navigation}
                    onPress={() => {
                        if (allowHostTab) {
                            this.onHandSelectViewer(item);
                        } else {
                            this.goMemberInfoModal(item);
                        }
                    }}
                />
            );
        } else if (item.isTitle) {
            return <Text style={styles.sectionTitle}>{item.title}</Text>;
        } else {
            return null;
        }
    };

    renderSection = ({ item }) => {
        return (
            <FlatList
                data={item.list}
                numColumns={3}
                renderItem={this.renderItem}
                keyExtractor={this._keyExtractor}
            />
        );
    };

    renderSectionHeader = ({ section }) => {
        return <Text style={styles.sectionTitle}>{section.title}</Text>;
    };

    render() {
        const { currentRoom } = this.props.context;
        const { viewers } = this.state;
        const hostViewer = viewers.filter(
            v => currentRoom && v.user_id === currentRoom.user_id
        );
        const filter_viewers = viewers.filter(
            v => currentRoom && v.user_id !== currentRoom.user_id
        );
        const handselect_viewers = filter_viewers.filter(v => v.handselect);
        const audience_viewers = filter_viewers
            .filter(v => !v.handselect)
            .map(a => {
                return {
                    ...a,
                    is_audience: true,
                };
            });
        const stage_viewers = [...hostViewer, ...handselect_viewers].map(a => {
            return {
                ...a,
                is_stage: true,
            };
        });
        const sections = [];
        const stage_sections = {
            title: 'STAGE',
            key: 'stage',
            data: [
                {
                    key: 'stage',
                    list: stage_viewers,
                },
            ],
        };
        const audience_sections = {
            title: 'AUDIENCE',
            key: 'audience',
            data: [
                {
                    key: 'audience',
                    list: audience_viewers,
                },
            ],
        };
        if (stage_viewers.length > 0) {
            sections.push(stage_sections);
        }
        if (audience_viewers.length > 0) {
            sections.push(audience_sections);
        }
        const list_viewers = [...stage_viewers, ...audience_viewers];

        return (
            <HomeContainer
                onSwitchAllContent={this.onSwitchAllContent}
                centerTitle="ALL ROOMS"
            >
                <TopActions />
                <View style={styles.assembleContainer}>
                    <View style={{ flex: 1 }}>
                        {stage_viewers && stage_viewers.length == 0 && (
                            <>
                                <Text style={styles.sectionTitle}>STAGE</Text>
                                <Text style={styles.noStageViewers}>
                                    {
                                        'No one is on stage yet, \nplease check back later!'
                                    }
                                </Text>
                            </>
                        )}
                        {list_viewers.length > 0 && (
                            <SectionList
                                sections={sections}
                                renderSectionHeader={this.renderSectionHeader}
                                renderItem={this.renderSection}
                            />
                        )}
                    </View>
                </View>
                <BottomActions />
            </HomeContainer>
        );
    }
}

const mapStateToProps = (state, props) => {
    const { currentRoom } = props.context;
    const id = currentRoom?.assemble_id;
    const user_id = global.currentUser.user_id;
    var viewers = [];
    const viewersData = state.viewersData[id];
    if (viewersData && viewersData.data) {
        viewers = viewersData.data.data;
    }

    const viewerCreate = state.viewerData[user_id];
    if (viewerCreate && viewerCreate.data) {
        const viewer = viewerCreate.data.data;
        if (viewer && viewer.channel_id === id) {
            const activeIndex = viewers.findIndex(
                r => r.viewer_id === viewer.viewer_id
            );
            if (activeIndex < 0) {
                viewers = [...viewers, viewer];
            } else {
                viewers[activeIndex] = viewer;
            }
        }
    }

    const socketData = state.socket.data;
    const topic = state.socket.topic;
    var socket_viewer = null;
    if (socketData && typeof parseJSONorNot(socketData) === 'object') {
        socket_viewer = parseJSONorNot(socketData);
        if (socket_viewer.channel_id === id) {
            const activeIndex = viewers.findIndex(
                r => r.viewer_id === socket_viewer.viewer_id
            );
            if (topic.includes('update')) {
                if (activeIndex !== -1) {
                    viewers[activeIndex] = socket_viewer;
                }
            } else if (topic.includes('delete')) {
                if (activeIndex !== -1) {
                    viewers.splice(activeIndex, 1);
                }
            } else if (topic.includes('create')) {
                if (activeIndex === -1) {
                    viewers.push(socket_viewer);
                }
            }
        }
        console.log('@@@@@ socket data');
    }

    const filtered_viewers = viewers.filter(
        v => v.viewer_id && v.viewer_id != ''
    );

    filtered_viewers.sort((a, b) => {
        if (a.updated_at > b.updated_at) return -1;
        if (a.updated_at < b.updated_at) return 1;
        return 0;
    });

    var likeUser = null;
    const likeUserData = state.likeUser;
    if (likeUserData && likeUserData.data) {
        likeUser = likeUserData.data;
    }

    // console.log('@@@@@filtered_viewers', filtered_viewers);

    return {
        likeUser,
        viewers: filtered_viewers,
        error: viewersData && viewersData.error ? viewersData.error : null,
        loading: viewersData && viewersData.loading,
    };
};

const mapDispatchToProps = {
    getViewerByAssembleRequest,
    updateViewerRequest,
};

export default withMainContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Assembly)
);
