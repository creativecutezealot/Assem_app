import React, { createRef } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Image,
    Text,
    ScrollView,
    Linking,
    TouchableOpacity,
    Alert,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import { connect } from 'react-redux';
import { logout as logoutRequest } from '../../actions/auth/logout';
import styles from './styles';
import { clearInfo, getDisplayName } from '../../helpers/utils';
import { leaveChannel } from '../../helpers/agoraUtil';
import { destroyTrack } from '../../hooks/usePlaybackControls';
import { withMainContext } from '../../context';
import EndRoomModal from '../Assembly/endRoomModal';
import EndAudioModal from '../Audio/endAudioModal';

import constant from '../../styles/const';
import Navigation from '../../routers/navigation';
import {
    Touchable,
} from '../../components/index';
const img_person = require('../../assets/images/home/active_person.png');
const personIcon = require('../../assets/images/home/person.png');
const joinIcon = require('../../assets/images/home/join.png');
const startIcon = require('../../assets/images/home/start.png');
const logoutIcon = require('../../assets/images/home/logout.png');
const connectIcon = require('../../assets/images/home/manage.png');
const pathIcon = require('../../assets/images/home/path.png');
const redirectUrl = 'http://ec2-35-173-246-72.compute-1.amazonaws.com:3000/';
import { StreamChat } from 'stream-chat';
import { STREAM_API_KEY } from '../../helpers/config';
class Profile extends React.Component {
    // endRoomModalRef: EndRoomModal;
    // endAudioModalRef: EndAudioModal;

    static navigationOptions = {
        headerMode: 'none',
    };
    constructor(props) {
        super(props);
        this.state = {};
        this.endRoomModalRef = createRef();
        this.endAudioModalRef = createRef();
    }

    async componentDidMount() { }

    confirmLogout = callback => {
        Alert.alert(
            '',
            'Do you want to logout?',
            [
                {
                    text: 'Ok',
                    onPress: () => callback(),
                },
                {
                    text: 'Cancel',
                    onPress: () => console.warn('Logout Cancel'),
                    style: 'cancel',
                },
            ],
            {
                cancelable: true,
                onDismiss: () =>
                    console.warn(
                        'This alert was dismissed by tapping outside of the alert dialog.'
                    ),
            }
        );
    };

    /// Logout
    logOut = async () => {
        this.confirmLogout(async () => {
            this.props.logoutRequest();
            await clearInfo();
            global.currentUser = null;
            await destroyTrack();
            await leaveChannel();
            Navigation.navigate('LoginInput');
            const chatClient = StreamChat.getInstance(STREAM_API_KEY);
            await chatClient.disconnectUser();
        });
    };

    goHelp = async () => {
        const { currentRoom, currentAudio } = this.props.context;
        if (currentRoom) {
            this.showEndRoomModal(() => {
                Navigation.navigate('Home');
                Navigation.navigate('Tutorial', { help: true });
            });
            return;
        } else if (currentAudio) {
            this.showEndAudioModal(() => {
                Navigation.navigate('Home');
                Navigation.navigate('Tutorial', { help: true });
            });
            return;
        }
        Navigation.navigate('Home');
        Navigation.navigate('Tutorial', { help: true });
    };

    goSwitchClubs = async () => {
        Navigation.navigate('MyClubsModal');
    }

    openMailApp = () => {
        Linking.openURL('mailto:help@assembly.us'); // iOS
        return;
    };

    goScreens = name => {
        Navigation.navigate(name);
        this.closeMenu();
    };

    closeMenu = () => {
        Navigation.closeDrawer();
    };

    showEndRoomModal = (callback = () => { }) => {
        if (this.endRoomModalRef && this.endRoomModalRef.current) {
            this.endRoomModalRef.current.show(callback);
        }
    };

    showEndAudioModal = (callback = () => { }) => {
        if (this.endAudioModalRef && this.endAudioModalRef.current) {
            this.endAudioModalRef.current.show(callback);
        }
    };

    externalOpenLink = uri => {
        try {
            Linking.canOpenURL(redirectUrl).then(supported => {
                if (!supported) {
                    // eslint-disable-next-line no-alert
                    global.alert('Can`t not open this link.');
                } else {
                    Linking.openURL(redirectUrl);
                }
            });
        } catch (error) {
            console.log('@@@@@ ' + error);
        }
    };

    render() {
        const { clubs } = this.props;
        const user = global.currentUser;
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.backgroundView} />
                <StatusBar
                    backgroundColor={constant.colors.background}
                    barStyle={'light-content'}
                />
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.menucontainer}>
                        <View style={styles.menutopcontainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    Navigation.navigate('MemberInfoModal', {
                                        user,
                                    });
                                }}
                                style={styles.membersContainer}
                            >
                                <View style={styles.photoContainer}>
                                    <Image
                                        source={
                                            user.photo_url
                                                ? { uri: user.photo_url }
                                                : img_person
                                        }
                                        style={styles.photo}
                                    />
                                </View>
                            </TouchableOpacity>
                            <Touchable onPress={this.closeMenu}>
                                <View style={{ padding: 8 }}>
                                    <FontAwesomeIcon
                                        name={'times'}
                                        size={20}
                                        color={'white'}
                                    />
                                </View>
                            </Touchable>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={[styles.name, styles.tochableWrapper]}>
                                {user.first_name} {user.last_name}
                            </Text>
                            <Text style={styles.role}>
                                {user.job} {user.company}
                            </Text>
                        </View>

                        <Touchable
                            onPress={() => {
                                this.goScreens('EditMemberModal');
                            }}
                        >
                            <View style={styles.btnWrapper}>
                                <FontAwesomeIcon
                                    name={'user'}
                                    size={16}
                                    light
                                    color={'white'}
                                />
                                <Text style={styles.button}>EDIT PROFILE</Text>
                            </View>
                        </Touchable>
                        {/* <Touchable onPress={() => {
                            this.goScreens('MyClubsModal')
                        }}>
                            <View style={styles.btnWrapper}>
                                <FontAwesomeIcon name={"users"} size={16} light color={"white"}></FontAwesomeIcon>
                                <Text style={styles.button}>MY CLUBS</Text>
                            </View>
                        </Touchable> */}
                        {/* <Touchable onPress={() => {
                            this.goScreens('JoinClubModal');
                        }}>
                            <View style={styles.btnWrapper}>
                                <FontAwesomeIcon name={"repeat"} size={16} light color={"white"}></FontAwesomeIcon>
                                <Text style={styles.button}>JOIN CLUBS</Text>
                            </View>
                        </Touchable> */}
                        <Touchable onPress={this.openMailApp}>
                            <View style={styles.btnWrapper}>
                                <FontAwesomeIcon
                                    name={'paper-plane'}
                                    size={16}
                                    light
                                    color={'white'}
                                />
                                <Text style={styles.button}>EMAIL SUPPORT</Text>
                            </View>
                        </Touchable>
                        <Touchable onPress={this.goHelp}>
                            <View style={styles.btnWrapper}>
                                <FontAwesomeIcon
                                    name={'question-square'}
                                    size={16}
                                    light
                                    color={'white'}
                                />
                                <Text style={styles.button}>HELP TUTORIAL</Text>
                            </View>
                        </Touchable>
                        <Touchable onPress={this.goSwitchClubs}>
                            <View style={styles.btnWrapper}>
                                <FontAwesomeIcon
                                    name={'users-class'}
                                    size={16}
                                    light
                                    color={'white'}
                                />
                                <Text style={styles.button}>SWITCH CLUBS</Text>
                            </View>
                        </Touchable>
                        <Touchable onPress={this.logOut} style={styles.logoutBtnWrapper}>
                            <View style={styles.btnWrapper}>
                                <FontAwesomeIcon
                                    name={'sign-out'}
                                    size={16}
                                    light
                                    color={'white'}
                                />
                                <Text style={styles.button}>LOGOUT</Text>
                            </View>
                        </Touchable>
                        {clubs && clubs.length > 0 && (
                            <>
                                <Text style={[styles.role, { marginTop: 20 }]}>
                                    Member:
                                </Text>
                                {clubs.map(club => (
                                    <Text
                                        key={club.club_id}
                                        style={[
                                            styles.role,
                                            { marginTop: 4, marginLeft: 20 },
                                        ]}
                                    >
                                        {getDisplayName(club.club_name, '#')}
                                    </Text>
                                ))}
                            </>
                        )}
                    </View>
                    <EndRoomModal ref={this.endRoomModalRef} />
                    <EndAudioModal ref={this.endAudioModalRef} />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state, props) => {
    const user_id = global.currentUser ? global.currentUser.user_id : '';
    const clubData = state.clubsByUserGET[user_id];
    const clubs = clubData ? clubData.data : [];
    return {
        clubs,
    };
};

const mapDispatchToProps = {
    logoutRequest,
};

export default withMainContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Profile)
);
