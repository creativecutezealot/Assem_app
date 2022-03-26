import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Linking,
    SafeAreaView,
    ImageBackground,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import ImageView from 'react-native-image-viewing';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5Pro';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import NavigationService from '../../routers/navigation';
import constants from '../../styles/const';
import styles from './styles';
import { Container, MainButton } from '../../components/index';

import { getDisplayName, showFlashMsg } from '../../helpers/utils';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';
import MessageContext from '../MessageScreen/context';
const ENDPOINTS = APIConfig.apiEndpoints;

const img_person = require('../../assets/images/home/active_person.png');

class MemberInfo extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
    };
    static contextType = MessageContext;

    constructor(props) {
        super(props);
        const { user } = props.navigation.state.params;
        this.state = {
            user: user,
            connects: [],
            clubs: [],
            isFollow: false,
            isManager: false,
            loading: false,
            selectImage: [],
            showImageModal: false,
            followings: [],
            followers: [],
        };
    }

    componentDidMount() {
        this.setState({
            loading: true,
        });
        this.timerHandle = setInterval(() => this.getUser(), 1000);
    }

    componentWillUnmount() {
      if (this.timerHandle) {
        clearInterval(this.timerHandle);
        this.timerHandle = 0;
      }
    }

    fetchFollowInfo = () => {
        const { user } = this.props.navigation.state.params;
        this.getUser();
        this.getClubs();
        this.isFollowedUser(user.user_id);
        this.getFollowingUsers(user.user_id);
        this.getFollowerUsers();
        this.getManagersByClubId();
        this.setState({
            loading: false,
        });
    };

    getUser = async () => {
        const { user } = this.props.navigation.state.params;
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getUser(user.user_id),
            });
            if (data.status) {
                this.setState({
                    user: data.data,
                });
            }
        } catch (error) {
            showFlashMsg('Failed to load user info. Please try again', true);
        }
    };

    getClubs = async () => {
        const { user } = this.props.navigation.state.params;
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getClubsByUserId(user.user_id),
            });
            if (data.status) {
                this.setState({
                    clubs: data.connect,
                });
            }
        } catch (error) {
            showFlashMsg('Failed to load clubs. Please try again', true);
        }
    };

    getManagersByClubId = async () => {
        try {
            const { club } = this.props;
            const { user } = this.props.navigation.state.params;
            if (club) {
                const { data } = await axiosAjax({
                    method: 'get',
                    url: ENDPOINTS.getClubManagers(club.club_id),
                });
                if (data && data.status) {
                    if (data.data && data.data.length > 0) {
                        const managers = data.data.filter(
                            a => a.user_role !== 'admin'
                        );
                        this.setState({
                            isManager: managers.find(a =>
                                a.sort_key.includes(user.user_id)
                            ),
                        });
                    }
                }
            }
        } catch (error) {
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to load managers. Please try again', true);
        }
    };

    isFollowedUser = async id => {
        const { club } = this.props;
        if (!club) {
            return;
        }
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.connectUserWithId(id, club.club_id),
            });
            this.setState({
                isFollow: data.status,
            });
        } catch (error) {
            console.error(error);
        }
    };

    getFollowingUsers = async id => {
        const { club } = this.props;
        if (!club) {
            return;
        }
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.connectUsers(id, club.club_id),
            });
            if (data.status) {
                console.log('@@@@@ followings', data.connect);
                this.setState({
                    followings: data.connect,
                });
            }
        } catch (error) {
            showFlashMsg(
                'Failed to load users for this Club. Please try again',
                true
            );
        }
    };

    getFollowerUsers = async () => {
        const { user } = this.props.navigation.state.params;
        const { club } = this.props;
        if (!club) {
            return;
        }
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.connectFollowUsers(user.user_id, club.club_id),
            });
            if (data.status) {
                console.log('@@@@@ followers', data.connect.length);
                this.setState({
                    followers: data.connect,
                });
            }
        } catch (error) {
            showFlashMsg(
                'Failed to load users for this Club. Please try again',
                true
            );
        }
    };

    follow = async () => {
        const { user } = this.props.navigation.state.params;
        const { club } = this.props;
        if (!club) {
            return;
        }
        try {
            this.setState({
                loading: true,
                isFollow: !this.state.isFollow,
            });
            const { data } = await axiosAjax({
                method: 'post',
                url: ENDPOINTS.connectUser(),
                data: normailzeQSData({
                    opposite_id: user.user_id,
                    club_id: club.club_id,
                }),
            });
            this.setState({
                loading: false,
            });
            if (!data.status) {
                this.setState({
                    isFollow: !this.state.isFollow,
                });
            }
        } catch (error) {
            this.setState({
                loading: false,
                isFollow: !this.state.isFollow,
            });
            showFlashMsg('Failed to follow user. Please try again', true);
        }
    };

    following = async () => {
        const { user } = this.props.navigation.state.params;
        const { club } = this.props;
        if (!club) {
            return;
        }
        try {
            this.setState({
                loading: true,
                isFollow: !this.state.isFollow,
            });
            const { data } = await axiosAjax({
                method: 'delete',
                url: ENDPOINTS.delConnectUser(user.user_id, club.club_id),
            });
            this.setState({
                loading: false,
            });
            if (!data.status) {
                this.setState({
                    isFollow: !this.state.isFollow,
                });
            }
        } catch (error) {
            this.setState({
                loading: false,
                isFollow: !this.state.isFollow,
            });
            showFlashMsg('Failed to follow user. Please try again', true);
        }
    };

    sendVoiceNote = async () => {
        const { user } = this.props.navigation.state.params;
        const { club } = this.props;
        const { chatClient } = this.context;
        console.warn('chatClient: ', chatClient);
        if (!chatClient?.user?.id) return;
        if (!user.user_id) return;
        if (!club.club_id) return;
        const userId = user.user_id + '-' + club.club_id;
        const members = [chatClient.user.id, userId];
        const channels = await chatClient.queryChannels({
            distinct: true,
            members,
        });
        let currentChannel;
        if (channels.length === 1) {
            currentChannel = channels[0];
        } else {
            const channel = chatClient.channel('messaging', {
                members,
            });
            // channel.initialized = true;
            currentChannel = channel;
        }
        this.props.navigation.navigate('ChannelScreen', {
            channel: currentChannel,
        });
    };

    externalOpenLink = uri => {
        const redirectUrl = uri.includes('http') ? uri : `https://${uri}`;
        try {
            Linking.canOpenURL(redirectUrl).then(supported => {
                if (!supported) {
                    global.alert('Can`t not open this link.');
                } else {
                    Linking.openURL(redirectUrl);
                }
            });
        } catch (error) {
            console.error('externalOpenLink: ', error);
        }
    };

    render() {
        const { user, clubs, isFollow, loading } = this.state;
        const { hideVoiceNote } = this.props.navigation.state.params;

        return (
            <Container
                title="MEMBER PROFILE"
                scrollEnabled={true}
                contentNonScroll={false}
                isHome={true}
            >
                <NavigationEvents
                    onDidFocus={payload => {
                        this.fetchFollowInfo();
                    }}
                />
                <View style={styles.memberContainer}>
                    <View style={styles.photoContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    showImageModal: true,
                                    selectImage: [{ uri: user?.photo_url }],
                                });
                            }}
                        >
                            <ImageBackground
                                source={{ uri: user?.photo_url }}
                                style={styles.photo}
                                imageStyle={{ borderRadius: 8 }}
                            >
                                {this.state.isManager && (
                                    <View style={styles.managerBanner}>
                                        <Text style={{ color: 'white' }}>
                                            Manager
                                        </Text>
                                    </View>
                                )}
                                <View
                                    style={[
                                        styles.presence,
                                        {
                                            backgroundColor:
                                                user.presence === 'active'
                                                    ? '#00ff00'
                                                    : 'transparent',
                                        },
                                    ]}
                                />
                            </ImageBackground>
                        </TouchableOpacity>

                        <View>
                            {user.user_id !== global.currentUser.user_id && (
                                <MainButton
                                    onPress={
                                        isFollow ? this.following : this.follow
                                    }
                                    label={isFollow ? 'Following' : 'Follow'}
                                    styleWrapper={
                                        !isFollow
                                            ? styles.btnWrapper
                                            : styles.disableBtnWrapper
                                    }
                                />
                            )}
                            {user.user_id !== global.currentUser.user_id &&
                                !hideVoiceNote && (
                                    <MainButton
                                        onPress={this.sendVoiceNote}
                                        label={'Message'}
                                        styleWrapper={styles.btnWrapper}
                                    />
                                )}
                        </View>
                    </View>

                    <View style={styles.detailContainer}>
                        <Text style={[styles.role, { marginTop: 20 }]}>
                            {user?.first_name} {user?.last_name}
                        </Text>
                        <Text style={styles.role}>
                            {getDisplayName(user?.first_name + user?.last_name)}
                        </Text>
                        {user?.short_bio !== '' && (
                            <Text
                                style={[
                                    styles.role,
                                    { marginTop: 20, flexShrink: 1 },
                                ]}
                            >
                                {user?.short_bio}
                            </Text>
                        )}

                        <Text style={[styles.role, { marginTop: 20 }]}>
                            {user?.job}
                        </Text>
                        <Text style={styles.role}>
                            {user?.industry} {user?.company}
                        </Text>

                        {user && user?.web_site !== '' && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 20,
                                }}
                            >
                                <Text style={styles.role}>Website: </Text>
                                <Text
                                    onPress={() => {
                                        this.externalOpenLink(user?.web_site);
                                    }}
                                    style={[
                                        styles.role,
                                        {
                                            textDecorationLine: 'underline',
                                            color:
                                                constants.colors.primary_blue,
                                        },
                                    ]}
                                >
                                    {user?.web_site}
                                </Text>
                            </View>
                        )}
                        {user && user?.twitter_url !== '' && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={styles.role}>Twitter: </Text>
                                <Text
                                    onPress={() => {
                                        this.externalOpenLink(
                                            user?.twitter_url
                                        );
                                    }}
                                    style={[
                                        styles.role,
                                        {
                                            textDecorationLine: 'underline',
                                            color:
                                                constants.colors.primary_blue,
                                        },
                                    ]}
                                >
                                    {user?.twitter_url}
                                </Text>
                            </View>
                        )}
                        {user && user?.linkedin_url !== '' && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={styles.role}>LinkedIn: </Text>
                                <Text
                                    onPress={() => {
                                        this.externalOpenLink(
                                            user?.linkedin_url
                                        );
                                    }}
                                    style={[
                                        styles.role,
                                        {
                                            textDecorationLine: 'underline',
                                            color:
                                                constants.colors.primary_blue,
                                        },
                                    ]}
                                >
                                    {user?.linkedin_url}
                                </Text>
                            </View>
                        )}

                        {clubs && clubs.length > 0 && (
                            <>
                                <Text style={[styles.role, { marginTop: 20 }]}>
                                    Member:
                                </Text>
                                {clubs.map((club, index) => (
                                    <Text
                                        key={index}
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
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 44,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.state.followers.length > 0) {
                                        NavigationService.navigate(
                                            'FollowModal',
                                            {
                                                id: user.user_id,
                                                following: false,
                                            }
                                        );
                                    }
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '500',
                                        color: 'white',
                                    }}
                                >
                                    {this.state.followers.length} Followers
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.state.followings.length > 0) {
                                        NavigationService.navigate(
                                            'FollowModal',
                                            {
                                                id: user.user_id,
                                                following: true,
                                            }
                                        );
                                    }
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: '500',
                                        color: 'white',
                                        marginLeft: '15%',
                                    }}
                                >
                                    {this.state.followings.length} Following
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Spinner visible={loading} />
                <ImageView
                    images={this.state.selectImage}
                    imageIndex={0}
                    visible={this.state.showImageModal}
                    onRequestClose={() => {
                        this.setState({
                            selectImage: [],
                            showImageModal: false,
                        });
                    }}
                    HeaderComponent={() => {
                        return (
                            <SafeAreaView
                                style={{
                                    alignItems: 'flex-start',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            selectImage: [],
                                            showImageModal: false,
                                        });
                                    }}
                                    style={styles.closeButton}
                                >
                                    <FontAwesome5
                                        name="times"
                                        style={styles.closeIcon}
                                        light
                                    />
                                </TouchableOpacity>
                            </SafeAreaView>
                        );
                    }}
                />
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    club: state.currentClub.data,
});
export default connect(
    mapStateToProps,
    null
)(MemberInfo);
