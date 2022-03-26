import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import { request as getClubByUserRequest } from '../../actions/club/getClubByUserId';
import constants from '../../styles/const';
import styles from './styles';
import { MainButton, FOAVRoutePicker } from '../../components/index';
import { setObjInfo, showFlashMsg } from '../../helpers/utils';
import constVal from '../../helpers/constant';
import Player from './player';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';
import Navigation from '../../routers/navigation';

const ENDPOINTS = APIConfig.apiEndpoints;

class Tutorial extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
    };
    constructor(props) {
        super(props);
        this.audioDeviceSelectRef = React.createRef();
        this.state = {
            loading: false,
            audio_url: '',
            audio_duration: 0,
            audio_file_name: '',
        };
    }

    componentDidMount() {
        const id = global.currentUser.user_id;
        this.props.getClubByUserRequest({ id });
        this.getTutorAudio();
    }

    getTutorAudio = async () => {
        try {
            this.setState({
                loading: true,
            });
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.tutorAudio(),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                const {
                    audio_url,
                    audio_duration,
                    audio_file_name,
                } = data.data;
                this.setState({
                    audio_url,
                    audio_duration,
                    audio_file_name,
                });
            }
        } catch (error) {
            console.log('@@@@@ ' + error);
            this.setState({
                loading: false,
            });
            showFlashMsg('Failed to load help audio. Please try again', true);
        }
    };

    updateUser = async () => {
        const { phone } = this.props.navigation.state.params;
        try {
            this.setState({
                loading: true,
            });
            const { data } = await axiosAjax({
                method: 'patch',
                url: ENDPOINTS.updateUser(),
                data: normailzeQSData({
                    phone_number: phone,
                    loggedin: true,
                    userid: global.currentUser.user_id,
                }),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                global.currentUser = data.data;
                await setObjInfo(constVal.USER_KEY, data.data);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            showFlashMsg('Failed to update user info. Please try again', true);
        }
    };

    goNext = async () => {
        const { params } = this.props.navigation.state;
        const { userClubs } = this.props;
        if (params && params.help) {
            Navigation.back();
        } else {
            // await this.updateUser();
            // if (userClubs && Array.isArray(userClubs) && userClubs.length > 0) {
            //     Navigation.navigate("Start");
            // } else {
            //     Navigation.navigate("JoinClubModal");
            // }
            Navigation.navigate('MyClubsModal');
        }
    };

    render() {
        const backgroundColor = constants.colors.primary;
        return (
            <SafeAreaView style={[styles.container]}>
                <View style={styles.backgroundView} />
                <StatusBar
                    backgroundColor={backgroundColor}
                    barStyle={'light-content'}
                />
                <View style={styles.topWrapper}>
                    <View style={styles.logoIcon} />
                    <Text style={styles.logoTitle} />
                    <TouchableOpacity style={styles.logoIcon}>
                        <FontAwesomeIcon
                            name="headphones"
                            color={'white'}
                            size={24}
                            light
                        />
                        <FOAVRoutePicker style={styles.avRoutePicker} />
                    </TouchableOpacity>
                </View>
                <View style={styles.guideWrapper}>
                    <Text style={styles.guide}>WELCOME TO</Text>
                </View>
                <View style={styles.logoWrapper}>
                    <Image
                        source={require('../../assets/images/register/logo.png')}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.slide1}>
                    <Text style={[styles.text, { width: '80%' }]}>
                        {
                            'Here is a short audio tutorial. You may refer back to this help tutorial any time under Settings '
                        }
                        <FontAwesomeIcon
                            name="bars"
                            color={'white'}
                            style={styles.text}
                            light
                        />
                    </Text>
                    <Player url={this.state.audio_url} />
                </View>
                <MainButton
                    label={'NEXT'}
                    styleWrapper={styles.btnWrapper}
                    onPress={() => this.goNext()}
                />
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state, props) => {
    const id = global.currentUser.user_id;
    const userClubData = state.clubsByUserGET[id];
    const userClubs = userClubData ? userClubData.data : [];
    return {
        userClubs,
        error: userClubData ? userClubData.error : null,
    };
};

const mapDispatchToProps = {
    getClubByUserRequest,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tutorial);
