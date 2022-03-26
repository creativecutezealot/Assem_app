import React, { createRef } from 'react';
import {
    View,
    Text,
    Dimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { request as getClubsRequest } from '../../actions/club/getClubs';
import { request as connectClubRequest } from '../../actions/club/connectClub';
import { request as delConnectClubRequest } from '../../actions/club/delConnectClub';
import { request as getClubByUserRequest } from '../../actions/club/getClubByUserId';
import { withMainContext } from '../../context';

import Navigation from '../../routers/navigation';

import styles from './styles';
import CarouselCard from '../../components/cards/CarouselCard';
import { Container, MainButton, SanityModal } from '../../components/index';
import EndRoomModal from '../Assembly/endRoomModal';
import EndAudioModal from '../Audio/endAudioModal';

import { showFlashMsg } from '../../helpers/utils';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';

const R = require('ramda');

const ENDPOINTS = APIConfig.apiEndpoints;

const { width, height } = Dimensions.get('window');
const errorMsg = 'Please join at least one Club';
const errorIncorrect = 'Hmm, that doesn’t look like a valid invite code';
const requestCode =
    'Thank you for requesting an invite code for this club.\nWe will be in touch shortly.';

class JoinClub extends React.PureComponent {
    endRoomModalRef: EndRoomModal;
    endAudioModalRef: EndAudioModal;

    static navigationOptions = {
        headerMode: 'none',
    };
    constructor(props) {
        super(props);
        this.state = {
            clubs: [],
            selected: [],
            showError: false,
            errMsg: '',
            loading: false,
        };
        this.endRoomModalRef = createRef();
        this.endAudioModalRef = createRef();
    }

    componentDidMount() {
        // this.props.getClubsRequest();
        this.getClubsByUserId();
    }

    componentDidUpdate(prevProps) {
        const { clubs, error } = this.props;
        console.warn('clubs: ', clubs);
        if (clubs && clubs.length > 0 && clubs != prevProps.clubs) {
            this.setState({ clubs });
        }

        if (error && error !== prevProps.error) {
        }
    }

    showEndRoomModal = (callback = () => {}) => {
        if (this.endRoomModalRef && this.endRoomModalRef.current) {
            this.endRoomModalRef.current.show(callback);
        }
    };

    showEndAudioModal = (callback = () => {}) => {
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

    goClubInfo = async club => {
        const { currentRoom, currentAudio } = this.props.context;
        if (currentRoom) {
            this.showEndRoomModal(() => {
                this.goToJoinClub(club);
            });
            return;
        } else if (currentAudio) {
            this.showEndAudioModal(() => {
                this.goToJoinClub(club);
            });
            return;
        }
        this.goToJoinClub(club);
    };

    goToJoinClub = club => {
        const joined = this.getJoinItem(club);
        this.props.navigation.navigate('EnterClubInfoModal', { club, joined });
    };

    getClubsByUserId = async () => {
        const user = global.currentUser;
        try {
            this.setState({
                loading: true,
            });
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getClubsByUserId(user.user_id),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                if (data.connect && data.connect.length > 0) {
                    this.initSelected(data.connect);
                } else {
                    this.initSelected([]);
                }
            } else {
                this.handleModal(data.data);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to load clubs. Please try again', true);
        }
    };

    initSelected = data => {
        var selected = [];
        for (const idx in data) {
            const club = data[idx];
            selected.push(club.club_id);
        }
        this.setState({
            selected,
        });
    };

    getJoinItem = item => {
        const itemIndex = this.state.selected.findIndex(
            r => r === item.club_id
        );
        return itemIndex >= 0;
    };

    _renderItem = ({ item, index }) => {
        const joined = this.getJoinItem(item);
        return (
            <CarouselCard
                item={item}
                joined={joined}
                onPress={this.goClubInfo}
            />
        );
    };

    _onCloseScreen = () => {
        this.props.getClubByUserRequest({
            id: global.currentUser.user_id,
        });
        Navigation.back();
    };

    render() {
        const { clubs, showError, errMsg, loading, selected } = this.state;
        return (
            <Container
                title="JOIN CLUBS"
                hiddenBack={selected.length < 1}
                isHome={true}
                onBackPress={this._onCloseScreen}
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
                <NavigationEvents
                    onDidFocus={payload => {
                        this.props.getClubsRequest();
                        this.getClubsByUserId();
                    }}
                />
                <View style={styles.container}>
                    <View style={styles.guideWrapper}>
                        <Text style={styles.guide}>
                            {
                                'Join now or request access for\nClubs that interest you'
                            }
                        </Text>
                    </View>
                    <View style={styles.carouselWrapper}>
                        <Carousel
                            layout={'default'}
                            ref={ref => (this.carousel = ref)}
                            data={clubs}
                            sliderWidth={width}
                            itemWidth={width * 0.8}
                            renderItem={this._renderItem}
                            onSnapToItem={index =>
                                this.setState({ activeIndex: index })
                            }
                        />
                    </View>
                    {/* <Spinner visible={this.props.loading} /> */}
                    {selected.length > 0 && (
                        <MainButton
                            onPress={this._onCloseScreen}
                            label={'FINISH'}
                            styleWrapper={[
                                styles.btnWrapper,
                                { marginTop: 70 },
                            ]}
                        />
                    )}
                </View>
                <EndRoomModal ref={this.endRoomModalRef} />
                <EndAudioModal ref={this.endAudioModalRef} />
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    clubs: state.clubsGET.data ? state.clubsGET.data.data : [],
    error: state.clubsGET.error ? state.clubsGET.error : null,
    loading: state.clubsGET.loading,
});

const mapDispatchToProps = {
    getClubsRequest,
    connectClubRequest,
    delConnectClubRequest,
    getClubByUserRequest,
};

export default withMainContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(JoinClub)
);
