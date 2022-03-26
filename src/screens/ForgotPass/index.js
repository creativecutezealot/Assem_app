import React from 'react';
import {
    View,
    Text,
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
const errorEmail = 'Hmm, we don\'t recognize that email, please try again.';

class ForgotPass extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
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

    onChangeEmail = text => {
        this.setState({ email: text });
    };

    goVerify = () => {
        const { email } = this.state;
        this.props.navigation.navigate('ConfirmPassCode', { email });
    };

    onForgotPass = async () => {
        const { email } = this.state;
        if (!isEmail(email)) {
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
        const { email } = this.state;
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
                this.goVerify();
            } else {
                this.handleModal(data.data);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to forgot password. Please try again', true);
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
                                TROUBLE LOGGING IN?
                            </Text>
                            <Text style={styles.guideDes}>
                                {
                                    'Enter your email and we\'ll send you a code\nto get back into your account'
                                }
                            </Text>
                        </View>
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            style={styles.textInputWrapper1}
                            onChangeText={text => this.onChangeEmail(text)}
                            placeholder={'USER EMAIL'}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={this.state.email}
                        />
                    </KeyboardAvoidingView>
                    <MainButton
                        label={'NEXT'}
                        styleWrapper={styles.btnWrapper}
                        onPress={() => this.onForgotPass()}
                    />
                </View>
            </Container>
        );
    }
}
export default ForgotPass;
