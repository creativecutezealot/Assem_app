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
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, SanityModal, MainButton } from '../../components/index';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';

const ENDPOINTS = APIConfig.apiEndpoints;
const errorCode = 'Hmm, that’s not the right code. Please try again.';
const resendMsg =
    'We just re-sent a verification code to your phone number. If you don’t see our sms, check your spam folder.';

class EnterCode extends React.PureComponent {
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

    goNext = (user_id: String = '') => {
        this.props.navigation.navigate('EnterPhone');
    };

    onGetACode = async () => {
        const { code } = this.state;
        if (code.length < 4) {
            this.handleModal(errorCode);
        } else {
            Keyboard.dismiss();
            this.setState({
                loading: true,
            });
            this.aCodeRequest();
        }
    };

    aCodeRequest = async () => {
        const { code } = this.state;
        try {
            const { data } = await axiosAjax({
                method: 'get',
                url: ENDPOINTS.getACode(code),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                this.goNext();
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
                                {
                                    'We sent a verification code via phone number. If you\ndon\'t see our sms, please try again.'
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
                        {/* <View style={styles.textWrapper}>
                            <Text style={styles.comment}>DIDN"T RECEIVE THE CODE?</Text>
                            <TouchableOpacity onPress={() => this.onForgotPass()}>
                                <Text style={styles.resend}>RESEND</Text>
                            </TouchableOpacity>
                        </View> */}
                    </KeyboardAvoidingView>
                    <MainButton
                        label={'NEXT'}
                        styleWrapper={styles.btnWrapper}
                        onPress={() => this.onGetACode()}
                    />
                </View>
            </Container>
        );
    }
}
export default EnterCode;
