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
import { isEmail, showFlashMsg } from '../../helpers/utils';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, SanityModal, MainButton } from '../../components/index';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

const ENDPOINTS = APIConfig.apiEndpoints;
const errorCode = 'Hmm, that’s not the right code. Please try again.';
const resendMsg =
    'We just re-sent a verification code to your email. If you don’t see our email, check your spam folder.';

class ConfirmPassCode extends React.PureComponent {
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

    goResetPass = user_id => {
        this.props.navigation.navigate('ResetPass', { user_id });
    };

    onRestPass = async () => {
        const { code } = this.state;
        if (code.length < 4) {
            this.handleModal(errorCode);
        } else {
            Keyboard.dismiss();
            this.setState({
                loading: true,
            });
            this.resetPass();
        }
    };

    resetPass = async () => {
        const { code } = this.state;
        try {
            const { data } = await axiosAjax({
                method: 'post',
                url: ENDPOINTS.resetPass(),
                data: normailzeQSData({ token: code }),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                const user_id = data.data;
                this.goResetPass(user_id);
            } else {
                this.handleModal(errorCode);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            this.handleModal(errorCode);
        }
    };

    onForgotPass = async () => {
        const { email } = this.props.navigation.state.params;
        if (!isEmail(email)) {
            const errorEmail = 'This Email is not valid';
            this.handleModal(errorEmail);
        } else {
            Keyboard.dismiss();
            this.setState({
                loading: true,
            });
            this.forgotPass();
        }
    };

    forgotPass = async () => {
        const { email } = this.props.navigation.state.params;
        try {
            const { data } = await axiosAjax({
                method: 'post',
                url: ENDPOINTS.forgotPass(),
                data: normailzeQSData({ email }),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                setTimeout(() => {
                    this.handleModal(resendMsg);
                }, 300);
            } else {
                setTimeout(() => {
                    this.handleModal(data.data);
                }, 300);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            showFlashMsg(
                'Failed to send confirmation code. Please try again',
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
                    cancelText={`I'll stay`}
                    hasClose={false}
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
                                {
                                    'We sent a verification code via email. If you\ndon\'t see our email, check your spam folder.'
                                }
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
                                onPress={() => this.onForgotPass()}
                            >
                                <Text style={styles.resend}>RESEND</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                    <MainButton
                        label={'NEXT'}
                        styleWrapper={styles.btnWrapper}
                        onPress={() => this.onRestPass()}
                    />
                </View>
            </Container>
        );
    }
}
export default ConfirmPassCode;
