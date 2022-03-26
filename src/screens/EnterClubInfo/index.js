import React from 'react';
import {
    View,
    Text,
    Dimensions,
    TextInput,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';

import { request as getClubsRequest } from '../../actions/club/getClubs';
import { request as connectClubRequest } from '../../actions/club/connectClub';
import { request as delConnectClubRequest } from '../../actions/club/delConnectClub';

import constants from '../../styles/const';
import styles from './styles';
import {
    Container,
    MainButton,
    SanityModal,
    ClubHeader,
} from '../../components/index';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

import { showFlashMsg } from '../../helpers/utils';

import NavigationService from '../../routers/navigation';
import { StreamChat } from 'stream-chat';
import { STREAM_API_KEY } from '../../helpers/config';

const ENDPOINTS = APIConfig.apiEndpoints;

const { width, height } = Dimensions.get('window');
const errorMsg = 'Please join at least one Club';
const cancelMembership = 'Do you really want to cancel your Membership?';
const errorIncorrect = 'Hmm, that doesn’t look like a valid invite code';
const requestCode =
    'Thank you for requesting an invite code for this club.\nWe will be in touch shortly.';

class EnterClubInfo extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
    };
    constructor(props) {
        super(props);
        const { club, joined } = this.props.navigation.state.params;
        this.state = {
            club,
            joined,
            showError: false,
            errMsg: '',
            loading: false,
            access_code: '',
        };
    }

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    loginUser = async (config, callback) => {
        try {
            const client = StreamChat.getInstance(STREAM_API_KEY);
            const user = {
                id: config.userId,
                image: config.userImage,
                name: config.userName,
            };

            const userToken = client.devToken(config.userId);
            await client.disconnectUser();
            await client.connectUser(user, userToken);
            callback(client);
        } catch (error) {
            console.warn(error);
        }
    };

    connectClub = () => {
        const { club, joined, access_code } = this.state;
        if (club.is_private && !joined) {
            if (club.access_code !== access_code) {
                this.handleModal(errorIncorrect);
                return;
            }
        }
        if (joined) {
            this.handleModal(cancelMembership);
        } else {
            this.joinClub();
        }
    };

    joinClub = async () => {
        const { club, joined, access_code } = this.state;
        this.setState({
            loading: true,
        });
        if (joined) {
            this.props.delConnectClubRequest({
                club_id: club.club_id,
                isJoined: true,
                userid: global.currentUser.user_id,
            });
            this.setState({ joined: false });
        } else {
            this.props.connectClubRequest({
                club_id: club.club_id,
                isJoined: true,
                userid: global.currentUser.user_id,
            });
            // const user = {
            //     userId: global.currentUser.user_id + '-' + club.club_id,
            //     userImage: global.currentUser.photo_url,
            //     userName: global.currentUser.first_name + ' ' + global.currentUser.last_name
            // }
            // this.loginUser(user, (client) => {
            //     console.warn('join club: ', client);
            // });
            this.setState({ joined: true });
        }
        setTimeout(() => {
            console.warn('joinclub5: ');
            this.setState(
                {
                    loading: false,
                },
                () => {
                    NavigationService.back();
                }
            );
        }, 1000);
    };

    requestClub = async () => {
        const { club, joined, access_code } = this.state;
        if (club.is_private) {
            try {
                this.setState({
                    loading: true,
                });
                const payload = {
                    club_id: club.club_id,
                };
                const { data } = await axiosAjax({
                    method: 'post',
                    url: ENDPOINTS.requestClubAccess(),
                    data: normailzeQSData(payload),
                });
                this.setState({
                    loading: false,
                });
                if (data.status) {
                    this.handleModal(requestCode);
                }
            } catch (error) {
                this.setState({
                    loading: false,
                });
                console.log('@@@@@ ' + error);
                showFlashMsg('Failed to join club. Please try again', true);
            }
        }
    };

    onChangeCode = access_code => {
        this.setState({
            access_code,
        });
    };

    render() {
        const {
            club,
            showError,
            errMsg,
            loading,
            access_code,
            joined,
        } = this.state;
        return (
            <Container
                Container
                title="CLUB INFO"
                isHome={true}
                scrollEnabled={true}
            >
                <SanityModal
                    show={showError}
                    msg={errMsg}
                    onCancel={() => {
                        this.handleModal();
                    }}
                    onConfirm={() => {
                        this.handleModal();
                        if (errMsg === cancelMembership) {
                            this.joinClub();
                        }
                    }}
                />
                <View style={styles.container}>
                    <ClubHeader club={club} />
                    <Text style={styles.guide}>{club.club_name}</Text>
                    <Text style={[styles.guideDes, { marginTop: '12%' }]}>
                        {club.description}
                    </Text>
                    {/* <Text style={[styles.guideDes, { marginTop: '5%' }]}>Membership dues are: ${club.memebership}/month</Text> */}
                    {club.is_private && (
                        <Text style={[styles.guideDes, { marginTop: '5%' }]}>
                            This is a private club that requires an invite code.
                        </Text>
                    )}
                    {club.is_private && !joined && (
                        <Text
                            style={[
                                styles.guideDes,
                                {
                                    textDecorationLine: 'underline',
                                    marginTop: 8,
                                },
                            ]}
                            onPress={this.requestClub}
                        >
                            REQUEST INVITE CODE
                        </Text>
                    )}
                    <View style={{ marginTop: '20%' }}>
                        {club.is_private && !joined && (
                            <TextInput
                                placeholderTextColor={
                                    constants.colors.placeholder
                                }
                                style={[styles.textInputWrapper]}
                                onChangeText={text => this.onChangeCode(text)}
                                placeholder={'ENTER INVITE CODE'}
                                value={access_code}
                                autoCapitalize={'none'}
                            />
                        )}
                        <MainButton
                            onPress={() => this.connectClub()}
                            label={joined ? 'CANCEL MEMBERSHIP' : 'JOIN'}
                            styleWrapper={[
                                styles.btnWrapper,
                                { marginTop: 20 },
                            ]}
                        />
                    </View>
                    <Spinner visible={loading} />
                </View>
            </Container>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    getClubsRequest,
    connectClubRequest,
    delConnectClubRequest,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EnterClubInfo);
