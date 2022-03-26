import React, { createRef } from 'react';
import {
    View,
    Text,
    Dimensions,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { connect } from 'react-redux';
import { withMainContext, SORT_TYPE } from '../../context';

import { request as getListByClubIdRequest } from '../../actions/club/getListByClubId';
import { request as connectClubRequest } from '../../actions/club/connectClub';
import { request as delConnectClubRequest } from '../../actions/club/delConnectClub';
import { request as getClubByUserRequest } from '../../actions/club/getClubByUserId';
import { update as currentClubUpdateRequest } from '../../actions/club/currentClub';

import styles from './styles';
import {
    Container,
    SanityModal,
    ClubCard,
} from '../../components/index';
import Navigation from '../../routers/navigation';
import EndRoomModal from '../Assembly/endRoomModal';
import EndAudioModal from '../Audio/endAudioModal';

import APIConfig from '../../api/const';

import { StreamChat } from 'stream-chat';
import { STREAM_API_KEY } from '../../helpers/config';

const ENDPOINTS = APIConfig.apiEndpoints;

const { width, height } = Dimensions.get('window');
const errorMsg = 'Please choose at least one Club';
const errorIncorrect = 'Hmm, that doesn’t look like a valid invite code';

class MyClubs extends React.PureComponent {
    // endRoomModalRef: EndRoomModal;
    // endAudioModalRef: EndAudioModal;

    static navigationOptions = {
        headerMode: 'none',
    };
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            showError: false,
            errMsg: '',
            loading: false,
            currentItem: null,
            activeIndex: 0,
        };
        this.endRoomModalRef = createRef();
        this.endAudioModalRef = createRef();
    }

    componentDidMount() {
        const id = global.currentUser.user_id;
        this.props.getClubByUserRequest({ id });
        if (this.props.club) {
            this.initSelected([this.props.club]);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.club !== prevProps.club) {
            this.initSelected([this.props.club]);
        }
    }

    initSelected = data => {
        if (data && data.length > 0) {
            var selected = [];
            for (const idx in data) {
                const club = data[idx];
                selected.push(club.club_id);
            }
            this.setState({
                selected,
            });
        }
    };

    showEndRoomModal = () => {
        if (this.endRoomModalRef && this.endRoomModalRef.current) {
            this.endRoomModalRef.current.show();
        }
    };

    showEndAudioModal = (callback = () => { }) => {
        if (this.endAudioModalRef && this.endAudioModalRef.current) {
            this.endAudioModalRef.current.show(callback);
        }
    };

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    goBack = () => {
        const { selected } = this.state;
        if (selected.length < 1) {
            this.handleModal(errorMsg);
            return;
        }
        Navigation.back();
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

    connectClub = item => {
        const { club } = this.props;
        const { currentRoom, currentAudio } = this.props.context;
        this.setState(
            {
                currentItem: item,
            },
            () => {
                if (club) {
                    // const user = {
                    //     userId: global.currentUser.user_id + '-' + club.club_id,
                    //     userImage: global.currentUser.photo_url,
                    //     userName: global.currentUser.first_name + ' ' + global.currentUser.last_name
                    // }
                    // this.loginUser(user, (client) => {
                    //     console.warn('enter club: ', client);
                    // });
                    if (club.club_id === item.club_id) {
                        Navigation.back();
                        Navigation.closeDrawer();
                        return;
                    } else {
                        if (currentRoom) {
                            this.showEndRoomModal(() => {
                                // this.updateClub();
                                Navigation.navigate('Home');
                            });
                            return;
                        } else if (currentAudio) {
                            this.showEndAudioModal(() => {
                                // this.updateClub();
                                Navigation.navigate('Home');
                            });
                            return;
                        }
                        this.updateClub();
                        Navigation.back();
                        Navigation.closeDrawer();
                    }
                } else {
                    this.updateClub();
                    Navigation.back();
                    Navigation.closeDrawer();
                }
            }
        );
    };

    updateClub = () => {
        const { currentItem } = this.state;
        this.props.connectClubRequest({
            club_id: currentItem.club_id,
            userid: global.currentUser.user_id,
        });
        this.props.currentClubUpdateRequest(currentItem);
        this.props.getListByClubIdRequest({ id: currentItem.club_id });
        this.setState({
            selected: [...this.state.selected, currentItem.club_id],
        });
        this.props.context.toggleSortType(SORT_TYPE.assemble_all);
    };

    disabledItem = item => {
        const itemIndex = this.state.selected.findIndex(
            r => r === item.club_id
        );
        return itemIndex >= 0;
    };

    _renderItem = ({ item, index }) => {
        const disabled = this.disabledItem(item);
        return (
            <ClubCard item={item} disabled={false} onPress={this.connectClub} />
        );
    };

    get pagination () {
      const { userClubs } = this.props;
      const { activeIndex } = this.state;
      return (
          <Pagination
            dotsLength={userClubs.length}
            activeDotIndex={activeIndex}
            containerStyle={styles.paginationWrapper}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.92)'
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
      );
  }

    goScreens = name => {
        Navigation.navigate(name);
    };

    render() {
        const { showError, errMsg, loading } = this.state;
        const { userClubs } = this.props;
        return (
            <Container
                title={'MY CLUBS'}
                onBackPress={this.goBack}
                isHome={true}
            >
                <SanityModal
                    show={showError}
                    msg={errMsg}
                    onCancel={() => {
                        this.handleModal();
                    }}
                    onConfirm={() => {
                        this.handleModal();
                    }}
                />
                <View style={styles.container}>
                    <View style={styles.guideWrapper}>
                        <Text style={styles.guide}>
                            Choose the Club that you wish to Enter.
                        </Text>
                    </View>
                    <View style={styles.carouselWrapper}>
                        <Carousel
                            layout={'default'}
                            ref={ref => (this.carousel = ref)}
                            data={userClubs}
                            sliderWidth={width}
                            itemWidth={width * 0.8}
                            renderItem={this._renderItem}
                            onSnapToItem={index =>
                                this.setState({ activeIndex: index })
                            }
                        />
                    </View>
                    { this.pagination }
                    {/* <Spinner visible={this.props.loading} /> */}
                    {/* <Touchable onPress={() => {
                        this.goScreens('JoinClubModal');
                    }}>
                        <View style={styles.btnWrapper}>
                            <Text style={styles.button}>JOIN CLUBS</Text>
                        </View>
                    </Touchable> */}
                </View>
                <EndRoomModal ref={this.endRoomModalRef} onEndCallBack={() => this.updateClub()} />
                <EndAudioModal ref={this.endAudioModalRef} />
            </Container>
        );
    }
}

const mapStateToProps = (state, props) => {
    const id = global.currentUser.user_id;
    const club = state.currentClub.data;
    const userClubData = state.clubsByUserGET[id];
    const userClubs = userClubData ? userClubData.data : [];
    return {
        club,
        userClubs,
        error: userClubData ? userClubData.error : null,
        loading: userClubData && userClubData.loading,
    };
};

const mapDispatchToProps = {
    getListByClubIdRequest,
    connectClubRequest,
    delConnectClubRequest,
    getClubByUserRequest,
    currentClubUpdateRequest,
};

export default withMainContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(MyClubs)
);
