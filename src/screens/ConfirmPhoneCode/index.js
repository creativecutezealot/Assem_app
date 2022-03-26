import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
} from 'react-native';
import constants from '../../styles/const';
import styles from './styles';
import { showFlashMsg, setObjInfo } from '../../helpers/utils';
import constVal from '../../helpers/constant';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, SanityModal, MainButton } from '../../components/index';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

const ENDPOINTS = APIConfig.apiEndpoints;
const errorCode = 'Hmm, that’s not the right code. Please try again.';
const resendMsg =
    'We just re-sent a verification code to your phone number. If you don’t see our sms, please try again.';

class ConfirmPhoneCode extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            code: '',
            showError: false,
            errMsg: '',
        };
    }

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    onChangeCode = code => {
        this.setState({ code });
    };

    goEnterEmail = (phone = '') => {
        this.props.navigation.navigate('EnterEmail', { phone });
    };

    goTutorial = async phone => {
        const { navigation } = this.props;
        const { data } = await axiosAjax({
            method: 'patch',
            url: ENDPOINTS.updateVCode(phone),
            data: normailzeQSData({ email: global.currentUser.email.trim() }),
        });
        if (data.status) {
            global.currentUser = data.data;
            await this.updateUser(phone);
            navigation.navigate('Tutorial');
        } else {
            this.handleModal(data.data);
        }
    };

    updateUser = async phone => {
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

    onVerifyCode = async () => {
        const { code } = this.state;
        if (code.length < 4) {
            this.handleModal(errorCode);
        } else {
            Keyboard.dismiss();
            this.setState({
                loading: true,
            });
            this.verifyCode();
        }
    };

    verifyCode = async () => {
        const { code } = this.state;
        const { phone } = this.props.navigation.state.params;
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getVCode(code),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                // this.goEnterEmail(phone);
                this.goTutorial(phone);
            } else {
                this.handleModal(data.data);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            this.handleModal(errorCode);
        }
    };

    onEnterPhone = async () => {
        const { phone } = this.props.navigation.state.params;
        try {
            this.setState({
                loading: true,
            });
            const { data } = await axiosAjax({
                method: 'post',
                url: ENDPOINTS.postVCode(),
                data: normailzeQSData({ phone }),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                this.handleModal(resendMsg);
            } else {
                this.handleModal(data.data);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            console.log('@@@@@ ' + error);
            showFlashMsg(
                'Failed to verify phone number. Please try again',
                true
            );
        }
    };

    render() {
        const { showError, errMsg, loading } = this.state;
        return (
            <Container>
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
                <Spinner visible={loading} />
                <View style={styles.container}>
                    <KeyboardAvoidingView>
                        <View style={styles.guideWrapper}>
                            <Text style={styles.guide}>
                                ENTER VERIFICATION CODE
                            </Text>
                            <Text style={styles.guideDes}>
                                {'We sent a verification code via phone number'}
                            </Text>
                        </View>
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            style={styles.textInputWrapper1}
                            onChangeText={text => this.onChangeCode(text)}
                            placeholder={'ENTER CODE'}
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            value={this.state.email}
                        />
                        <View style={styles.textWrapper}>
                            <Text style={styles.comment}>
                                {'DIDN\'T RECEIVE THE CODE?'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => this.onEnterPhone()}
                            >
                                <Text style={styles.resend}>RESEND</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                    <MainButton
                        label={'NEXT'}
                        styleWrapper={styles.btnWrapper}
                        onPress={() => this.onVerifyCode()}
                    />
                </View>
            </Container>
        );
    }
}
export default ConfirmPhoneCode;
