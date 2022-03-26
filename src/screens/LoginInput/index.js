import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
} from 'react-native';
import constants from '../../styles/const';
import styles from './styles';
import {
    isEmail,
    setObjInfo,
    checkPermissions,
    isPassword,
    showFlashMsg,
} from '../../helpers/utils';
import constVal from '../../helpers/constant';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, SanityModal, MainButton } from '../../components/index';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

import Aes from 'react-native-aes-crypto'

const ENDPOINTS = APIConfig.apiEndpoints;

const errorEmail = 'Hmm, we don\'t recognize that email, please try again.';
const errorPassword =
    'Hmm, that\'s not the right password. Please try again or request a new one.';
const errorApprove = 'Please complete the login process';

class LoginInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            email: '',
            showError: false,
            errMsg: '',
            loading: false,
        };
    }

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    onChangePassword = text => {
        this.setState({ password: text });
    };

    onChangeEmail = text => {
        this.setState({ email: text });
    };

    goJoinNow = () => {
        // Right now don't need
        this.props.navigation.navigate('EnterPhone');
    };

    goForgoten = () => {
        this.props.navigation.navigate('ForgotPass');
    };

    onLogin = () => {
        const { password, email } = this.state;
        if (!isEmail(email)) {
            this.handleModal(errorEmail);
        } else if (!isPassword(password)) {
            this.handleModal(errorPassword);
        } else {
            Keyboard.dismiss();
            this.login();
        }
    };

    login = async () => {
        const { password, email } = this.state;
        try {
            this.setState({
                loading: true,
            });
            const iv = '0123456789abcdef0123456789abcdef';
            const key = '591825e3a4f2c9b8f73eb963c77ad160d4802ad7aadc179b066275bcb9d9cfd2';
            const encryptedData = await this.encryptData(password, key, iv);
            console.log('encryptedData: ', encryptedData);
            
            const { data } = await axiosAjax({
                method: 'post',
                url: ENDPOINTS.login(),
                data: normailzeQSData({ email: email.trim(), password: encryptedData }),
            });

            this.setState({
                loading: false,
            });
            if (data.status) {
                this.loginComplete(data.data);
            } else {
                this.handleModal(data.data);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to login. Please try again', true);
        }
    };

    loginComplete = async userInfo => {
        global.currentUser = userInfo;
        await setObjInfo(constVal.USER_KEY, userInfo);
        if (userInfo.approved) {
            if (userInfo.loggedin) {
                this.goHome();
            } else {
                if (userInfo.phone_number === '') {
                    this.goJoinNow();
                } else {
                    this.goTutorial();
                }
            }
        } else {
            this.handleModal(errorApprove);
        }
    };

    goHome = () => {
        const { navigation } = this.props;
        checkPermissions();
        navigation.navigate('Start');
    };

    goTutorial = () => {
        const { navigation } = this.props;
        navigation.navigate('Tutorial');
    };

    generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length);

    encryptData = (text, key, iv) => Aes.encrypt(text, key, iv, 'aes-256-cbc');

    decryptData = (encryptedData, key, iv) => Aes.decrypt(encryptedData, key, iv, 'aes-256-cbc');

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
                <View style={styles.container}>
                    <KeyboardAvoidingView>
                        <View style={styles.logoWrapper}>
                            <Image
                                source={require('../../assets/images/register/logo.png')}
                                style={styles.logo}
                            />
                        </View>
                        <Spinner visible={loading} />
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            style={styles.textInputWrapper1}
                            onChangeText={text => this.onChangeEmail(text)}
                            placeholder={'USER EMAIL'}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={this.state.email}
                        />
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            style={styles.textInputWrapper2}
                            onChangeText={text => this.onChangePassword(text)}
                            placeholder={'PASSWORD'}
                            secureTextEntry={true}
                            value={this.state.password}
                        />
                        <TouchableOpacity
                            style={styles.forgotBtnWrapper}
                            onPress={() => this.goForgoten()}
                        >
                            <Text style={styles.forgotBtn}>
                                FORGOT PASSWORD?
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                    <MainButton
                        label={'LOGIN'}
                        styleWrapper={styles.btnWrapper}
                        onPress={() => this.onLogin()}
                    />
                    {/* <View style={styles.textWrapper}>
                        <Text style={styles.comment}>NOT A MEMBER YET?</Text>
                        <TouchableOpacity onPress={() => this.goJoinNow()}>
                            <Text style={styles.signBtn}>JOIN NOW</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </Container>
        );
    }
}
export default LoginInput;
