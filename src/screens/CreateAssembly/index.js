import React from 'react';
import {
    View,
    Image,
    Text,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';

import constants from '../../styles/const';
import styles from './styles';

import { request as createAssembleRequest } from '../../actions/assemble/createAssemble';
import { request as getListByClubIdRequest } from '../../actions/club/getListByClubId';
import { request as getFollowUsersRequest } from '../../actions/user/getFollowUsers';
import { request as getFollowingUsersRequest } from '../../actions/user/getFollowingUsers';

import {
    Container,
    MainButton,
    TakePhoto,
    OptionButton,
    SanityModal,
} from '../../components/index';
import ConnectCard from '../../components/cards/ConnectCard/invite';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
    getCurrentLocalTime,
    showFlashMsg,
} from '../../helpers/utils';
import { ratio4_3 } from '../../helpers/config';
import Navigation from '../../routers/navigation';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';

const ENDPOINTS = APIConfig.apiEndpoints;

const R = require('ramda');

const topicErr = 'Please add a topic';
const desErr = 'Please add a description';
const dateErr = 'Please select the date!';
const dateOverErr = 'A Room can only one scheduled within the next week.';
const photoErr = 'Please upload an image.';
const memberErr = 'Please select at least one Member.';

class CreateAssembly extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
    };
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selected: [],
            clubUsers: [],
            search_memeber: '',
            topic: '',
            description: '',
            photo: '',
            currentDate: new Date(),
            date: moment().format('YYYY-MM-DD/hh:mm A'),
            showDatePicker: false,
            is_immediately: true,
            is_allow_all: true,
            is_following: false,
            is_select_members: false,
            is_enter_stage: true,
            completedStep: 0,
            showError: false,
            inputHeight: 100,
            errMsg: '',
            roomImages: [],
            select_photo: '',
        };
    }

    componentDidMount = () => {
        const id = global.currentUser.user_id;
        this.props.getFollowUsersRequest({ id });
        this.props.getFollowingUsersRequest({ id });
        if (this.props.club && this.props.club.club_id !== '') {
            this.getUsersByClubId(this.props.club);
            this.getRoomImagesByClubId(this.props.club);
        }
    };

    componentDidUpdate(prevProps) {
        const { assemble, club } = this.props;
        if (assemble && assemble !== prevProps.assemble) {
            console.log('@@@@@ create assemble', assemble);
            this.onGoBack();
            if (this.props.club) {
                this.props.getListByClubIdRequest({
                    id: this.props.club.club_id,
                });
            }
        }

        if (club && club !== prevProps.club) {
            this.getUsersByClubId(club);
            this.getRoomImagesByClubId(club);
        }
    }

    getUsersByClubId = async club => {
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getUsersByClubId(club.club_id),
            });
            if (data && data.status) {
                if (data.connect && data.connect.length > 0) {
                    const currentUserId = global.currentUser.user_id;
                    const newusers = data.connect.filter(
                        user => user.user_role !== 'admin'
                    );
                    this.setState({
                        clubUsers: newusers.filter(
                            user => user.user_id !== currentUserId
                        ),
                    });
                }
            }
        } catch (error) {
            console.log('@@@@@ ' + error);
            showFlashMsg(
                'Failed to load users for this Club. Please try again',
                true
            );
        }
    };

    getRoomImagesByClubId = async club => {
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getRoomImagesByClubId(club.club_id),
            });
            if (data && data.status) {
                if (data.data && data.data.length > 0) {
                    console.log('@@@@@ ' + data.data);
                    this.setState({
                        roomImages: data.data,
                    });
                }
            }
        } catch (error) {
            console.log('@@@@@ ' + error);
            showFlashMsg(
                'Failed to load room images for this Club. Please try again',
                true
            );
        }
    };

    onSelectUser = item => {
        const disabled = this.disabledItem(item);
        if (disabled) {
            this.setState({
                selected: this.state.selected.filter(r => r !== item.user_id),
            });
        } else {
            this.setState({
                selected: [...this.state.selected, item.user_id],
            });
        }
    };

    disabledItem = item => {
        const itemIndex = this.state.selected.findIndex(
            r => r === item.user_id
        );
        return itemIndex >= 0;
    };

    onChangeInput = (key, text) => {
        this.setState({ [key]: text });
    };

    onChangeURI = photo => {
        this.setState({ photo, select_photo: '' });
    };

    handleShowDatePicker = () => {
        this.setState({
            showDatePicker: !this.state.showDatePicker,
        });
    };

    handleChangeDate = selectedDate => {
        const currentDate = selectedDate || this.state.date;
        if (
            new Date(selectedDate).getTime() >
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        ) {
            this.setState(
                {
                    showDatePicker: false,
                },
                () => {
                    setTimeout(() => {
                        this.handleError(dateOverErr);
                    }, 500);
                }
            );
        } else {
            this.setState({
                showDatePicker: false,
                date: moment(currentDate).format('YYYY-MM-DD/hh:mm A'),
                currentDate,
            });
        }
    };

    validationStepOne = () => {
        const { topic, description, photo } = this.state;
        if (topic == '') {
            this.handleError(topicErr);
        } else if (description == '') {
            this.handleError(desErr);
        } 
        else {
            this.setState({
                completedStep: 1,
            });
        }
    };

    validationStepTwo = () => {
        this.setState({
            showDatePicker: false,
        });
        const { date, is_immediately, is_allow_all, is_following } = this.state;
        if (date == '' && !is_immediately) {
            this.handleError(dateErr);
        } else {
            if (is_allow_all || is_following) {
                this.createAssemble();
            } else {
                this.setState({
                    completedStep: 2,
                });
            }
        }
    };

    validationStepThree = () => {
        const { selected } = this.state;
        if (selected.length < 1) {
            this.handleError(memberErr);
        } else {
            this.createAssemble();
        }
    };

    createAssemble = () => {
        const {
            clubUsers,
            selected,
            photo,
            select_photo,
            topic,
            description,
            date,
            is_immediately,
            is_allow_all,
            is_following,
            is_enter_stage,
        } = this.state;
        const { club } = this.props;
        const selected_users = [];
        clubUsers.forEach(user => {
            if (selected.includes(user.user_id)) {
                selected_users.push(user);
            }
        });
        const payload = {
            assemble_name: topic,
            is_immediately,
            is_allow_all,
            is_following,
            is_enter_stage,
            description,
            photo_url: select_photo !== '' ? select_photo : photo,
            start_time: getCurrentLocalTime(moment(date, 'YYYY-MM-DD/hh:mm A')),
            enter_club_id: club.club_id,
            enter_club_name: club.club_name,
            host_id: global.currentUser.user_id,
            host_name: `${global.currentUser.first_name} ${
                global.currentUser.last_name
            }`,
            selected_users,
        };
        console.log('@@@@@ payload', payload);
        this.props.createAssembleRequest(payload);
    };

    gotoNext = () => {
        const { completedStep } = this.state;
        if (completedStep == 0) {
            this.validationStepOne();
        } else if (completedStep == 1) {
            this.validationStepTwo();
        } else {
            this.validationStepThree();
        }
    };

    onGoBack = () => {
        this.setState({
            selected: [],
            search_memeber: '',
            topic: '',
            photo: '',
            select_photo: '',
            description: '',
            currentDate: new Date(),
            date: moment().format('YYYY-MM-DD/hh:mm A'),
            showDatePicker: false,
            is_immediately: true,
            completedStep: 0,
            is_allow_all: true,
            is_following: false,
            is_select_members: false,
            is_enter_stage: true,
        });
        Navigation.back();
    };

    renderUserItem = ({ item, index }) => {
        const disabled = this.disabledItem(item);
        return (
            <ConnectCard
                item={item}
                disabled={disabled}
                onPress={() => this.onSelectUser(item)}
            />
        );
    };

    renderImageItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        select_photo: item.photo_url,
                    });
                }}
            >
                <Image
                    source={{ uri: item.photo_url }}
                    style={{
                        width: 200,
                        height: 200 * 0.75,
                        borderRadius: 6,
                        marginRight: 10,
                    }}
                />
                {item.photo_url === this.state.select_photo && (
                    <FontawesomeIcon
                        style={{
                            position: 'absolute',
                            top: 5,
                            left: 5,
                            fontSize: 22,
                            color: '#66ff00',
                        }}
                        name="check-circle"
                        solid
                    />
                )}
            </TouchableOpacity>
        );
    };

    handleError = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    renderStepOne = () => {
        return (
            <>
                <View style={styles.itemContainer}>
                    <Text style={styles.guideDes}>{'What\'s the topic?'}</Text>
                    <TextInput
                        placeholderTextColor={constants.colors.placeholder}
                        style={styles.textInputWrapper}
                        onChangeText={text => this.onChangeInput('topic', text)}
                        placeholder={'TOPIC'}
                        value={this.state.topic}
                        maxLength={100}
                    />
                </View>
                <View style={styles.itemContainer}>
                    <Text style={[styles.guideDes,]}>
                        {'What\'s it about?'}
                    </Text>
                    <TextInput
                        placeholderTextColor={constants.colors.placeholder}
                        value={this.state.description}
                        style={[
                            styles.textInputWrapper,
                            {
                                height: Math.max(100, this.state.inputHeight),
                                paddingVertical: 10,
                            },
                        ]}
                        multiline={true}
                        maxLength={500}
                        onChangeText={text =>
                            this.onChangeInput('description', text)
                        }
                        placeholder={'DESCRIPTION'}
                        onContentSizeChange={e => {
                            this.setState({
                                inputHeight:
                                    e.nativeEvent.contentSize.height + 30,
                            });
                        }}
                    />
                </View>
                <View style={styles.itemContainer}>
                    <Text style={styles.guideDes}>{'Add a photo'}</Text>
                    <FlatList
                        style={{ marginTop: 20, width: '100%' }}
                        horizontal={true}
                        data={this.state.roomImages}
                        extraData={this.state}
                        ListHeaderComponent={() => {
                            return (
                                <View>
                                    <TakePhoto
                                        photoURL={this.state.photo}
                                        onChangeURI={this.onChangeURI}
                                        onCallBack={photo => {
                                            this.onChangeURI(photo);
                                            this.setState({
                                                select_photo: '',
                                            });
                                        }}
                                        ratio={ratio4_3}
                                        defaultW={200}
                                        defaultH={200 * 0.75}
                                        style={{
                                            marginTop: 0,
                                            marginRight: 10,
                                            borderRadius: 6,
                                        }}
                                    />
                                    {this.state.select_photo === '' &&
                                        this.state.photo !== '' && (
                                            <FontawesomeIcon
                                                style={{
                                                    position: 'absolute',
                                                    top: 5,
                                                    left: 5,
                                                    fontSize: 22,
                                                    color: '#66ff00',
                                                }}
                                                name="check-circle"
                                                solid
                                            />
                                        )}
                                </View>
                            );
                        }}
                        renderItem={this.renderImageItem}
                        keyExtractor={item => item.sort_key}
                    />
                </View>
            </>
        );
    };

    renderStepTwo = () => {
        const {
            date,
            showDatePicker,
            currentDate,
            is_immediately,
            is_allow_all,
            is_following,
            is_select_members,
            is_enter_stage,
        } = this.state;
        return (
            <>
                <View style={styles.itemContainer}>
                    <Text style={styles.guideDes}>{'When does it start?'}</Text>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            marginTop: 16,
                        }}
                    >
                        <OptionButton
                            label1={'Starts NOW'}
                            isChecked={is_immediately}
                            onPress={() =>
                                this.setState({
                                    is_immediately: !is_immediately,
                                })
                            }
                        />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            marginTop: 16,
                        }}
                    >
                        <OptionButton
                            label1={'Starts LATER'}
                            isChecked={!is_immediately}
                            onPress={() =>
                                this.setState({
                                    is_immediately: !is_immediately,
                                })
                            }
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            marginTop: 16,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: 'white',
                            display: is_immediately ? 'none' : 'flex'
                        }}
                        onPress={this.handleShowDatePicker}
                    >
                        <Text
                            style={[
                                styles.dateTxt,
                                { color: is_immediately ? 'gray' : 'white' },
                            ]}
                        >
                            {date}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePicker
                        titleIOS="DATE/TIME SELECTION"
                        is24Hour={true}
                        minimumDate={new Date()}
                        isVisible={showDatePicker}
                        onConfirm={this.handleChangeDate}
                        onCancel={this.handleShowDatePicker}
                        mode="datetime"
                        date={new Date()}
                    />
                </View>
                <View style={styles.itemContainer}>
                    <Text style={styles.guideDes}>
                        {'What type of Room is it?'}
                    </Text>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            marginTop: 16,
                        }}
                    >
                        <OptionButton
                            label1={'Members join on STAGE'}
                            isChecked={is_enter_stage}
                            onPress={() =>
                                this.setState({
                                    is_enter_stage: is_enter_stage,
                                })
                            }
                        />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            marginTop: 16,
                        }}
                    >
                        <OptionButton
                            label1={'Members join in AUDIENCE'}
                            isChecked={!is_enter_stage}
                            onPress={() =>
                                this.setState({
                                    is_enter_stage: !is_enter_stage,
                                })
                            }
                        />
                    </View>
                </View>
                <View style={styles.itemContainer}>
                    <Text style={styles.guideDes}>{'Who can attend?'}</Text>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            marginTop: 16,
                        }}
                    >
                        <OptionButton
                            label1={'All Members'}
                            isChecked={is_allow_all}
                            onPress={() =>
                                this.setState({
                                    is_allow_all: !is_allow_all,
                                    is_following: false,
                                    is_select_members: false,
                                })
                            }
                        />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            marginTop: 16,
                        }}
                    >
                        <OptionButton
                            label1={'Only Members I Follow'}
                            isChecked={is_following}
                            onPress={() =>
                                this.setState({
                                    is_following: !is_following,
                                    is_allow_all: false,
                                    is_select_members: false,
                                })
                            }
                        />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            marginTop: 16,
                        }}
                    >
                        <OptionButton
                            label1={'Only select Members'}
                            isChecked={is_select_members}
                            onPress={() =>
                                this.setState({
                                    is_select_members: !is_select_members,
                                    is_allow_all: false,
                                    is_following: false,
                                })
                            }
                        />
                    </View>
                </View>
            </>
        );
    };

    renderStepThree = () => {
        const { search_memeber, selected, clubUsers } = this.state;
        const invitedUsers = clubUsers.filter(user =>
            selected.includes(user.user_id)
        );
        const unInvitedUsers = clubUsers.filter(
            user => !selected.includes(user.user_id)
        );
        const newUsers = [...unInvitedUsers, ...invitedUsers];
        const filteredUsers = newUsers.filter(user =>
            `${user.first_name}${user.last_name}`
                .toLowerCase()
                .includes(search_memeber.toLowerCase())
        );
        return (
            <>
                <View style={styles.itemContainer}>
                    <Text style={styles.guideDes}>{'Who can attend?'}</Text>
                    <TextInput
                        placeholderTextColor={constants.colors.placeholder}
                        style={styles.textInputWrapper}
                        onChangeText={text =>
                            this.onChangeInput('search_memeber', text)
                        }
                        placeholder={'Search members'}
                        value={this.state.search_memeber}
                    />
                </View>
                <View style={[styles.itemContainer, styles.tableWrapper]}>
                    <FlatList
                        style={{ marginTop: 10, width: '100%' }}
                        numColumns={2}
                        horizontal={false}
                        data={filteredUsers}
                        extraData={this.state}
                        renderItem={this.renderUserItem}
                        keyExtractor={item => item.user_id}
                    />
                </View>
            </>
        );
    };

    render() {
        const {
            completedStep,
            loading,
            showError,
            errMsg,
            is_allow_all,
            is_following,
        } = this.state;
        const label =
            completedStep == 1 && (is_allow_all || is_following)
                ? 'DONE'
                : completedStep == 2
                ? 'DONE'
                : 'NEXT';
        return (
            <Container
                title="START ROOM"
                scrollEnabled={completedStep < 2 ? true : false}
                contentNonScroll={false}
                onBackPress={() => {
                    if (completedStep == 0) {
                        this.onGoBack();
                    } else {
                        this.setState({
                            completedStep: completedStep - 1,
                        });
                    }
                }}
                isHome={true}
                backType={completedStep < 1 ? 'close' : 'back'}
            >
                <View style={styles.container}>
                    <SanityModal
                        show={showError}
                        msg={errMsg}
                        onCancel={() => {
                            this.handleError();
                        }}
                        onConfirm={() => {
                            this.handleError();
                        }}
                    />
                    <KeyboardAvoidingView style={{ flex: 1, width: '100%' }}>
                        {completedStep == 0
                            ? this.renderStepOne()
                            : completedStep == 1
                            ? this.renderStepTwo()
                            : this.renderStepThree()}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <MainButton
                                onPress={() => {
                                    if (completedStep == 0) {
                                        this.onGoBack();
                                    } else {
                                        this.setState({
                                            completedStep: completedStep - 1,
                                        });
                                    }
                                }}
                                label={'Cancel'}
                                styleWrapper={[
                                    styles.btnWrapper,
                                    {
                                        marginTop: completedStep < 2 ? 44 : 24,
                                        backgroundColor: 'gray',
                                    },
                                ]}
                            />
                            <MainButton
                                onPress={() => this.gotoNext()}
                                label={label}
                                styleWrapper={[
                                    styles.btnWrapper,
                                    { marginTop: completedStep < 2 ? 44 : 24 },
                                ]}
                            />
                        </View>
                    </KeyboardAvoidingView>
                    <Spinner visible={this.props.loading || loading} />
                </View>
            </Container>
        );
    }
}

const mapStateToProps = (state, props) => {
    const id = global.currentUser.user_id;
    const club = state.currentClub.data;
    const followUsersData = state.usersFollowGET[id];
    const followUsers =
        followUsersData && followUsersData.data
            ? followUsersData.data.connect
            : [];
    const followingUsers =
        state.usersFollowingGET && state.usersFollowingGET.data
            ? state.usersFollowingGET.data.connect
            : [];
    return {
        club,
        assemble: state.assemblePOST.data ? state.assemblePOST.data.data : null,
        followUsers,
        followingUsers,
        error: state.usersGET.error || state.assemblePOST.error,
        loading: state.usersGET.loading || state.assemblePOST.loading,
    };
};

const mapDispatchToProps = {
    getFollowUsersRequest,
    getFollowingUsersRequest,
    getListByClubIdRequest,
    createAssembleRequest,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAssembly);