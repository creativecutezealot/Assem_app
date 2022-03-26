import React from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import constants from '../../styles/const';
import styles from './styles';
import { isPassword, showFlashMsg } from '../../helpers/utils';
import { Container, MainButton, SanityModal } from '../../components/index';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

const ENDPOINTS = APIConfig.apiEndpoints;
const errorPassword =
    'Password must include at least 8 characters including 1 number or 1 special character';
const errorMatch = 'Passwords do not match';

class ResetPass extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            password: '',
            confirmPassword: '',
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
    onChangePassword = text => {
        this.setState({ password: text });
    };

    onChangeConfirmPassword = text => {
        this.setState({ confirmPassword: text });
    };

    onUpdatePass = () => {
        const { password, confirmPassword } = this.state;
        if (!isPassword(password) || !isPassword(confirmPassword)) {
            this.handleModal(errorPassword);
            return;
        }

        if (password !== confirmPassword) {
            this.handleModal(errorMatch);
            return;
        }

        Keyboard.dismiss();
        this.setState({
            loading: true,
        });
        this.updatePass(password);
    };

    updatePass = async password => {
        const { user_id } = this.props.navigation.state.params;
        try {
            const { data } = await axiosAjax({
                method: 'patch',
                url: ENDPOINTS.updatePass(user_id),
                data: normailzeQSData({ password }),
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
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to reset password. Please try again', true);
        }
    };

    goNext = () => {
        this.props.navigation.navigate('CompleteResetPass');
    };

    render() {
        const { loading, showError, errMsg } = this.state;
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
                            <Text style={styles.guide}>FINALLY, CHOOSE</Text>
                            <Text style={styles.guide}>A NEW PASSWORD</Text>
                            <Text style={[styles.guideDes, { marginHorizontal: 10 }]}>{errorPassword}</Text>
                        </View>
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            style={styles.textInputWrapper1}
                            onChangeText={text => this.onChangePassword(text)}
                            placeholder={'NEW PASSWORD'}
                            secureTextEntry={true}
                            value={this.state.password}
                        />
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            style={styles.textInputWrapper2}
                            onChangeText={text =>
                                this.onChangeConfirmPassword(text)
                            }
                            placeholder={'RE-ENTER PASSWORD'}
                            secureTextEntry={true}
                            value={this.state.confirmPassword}
                        />
                    </KeyboardAvoidingView>
                    <MainButton
                        onPress={() => this.onUpdatePass()}
                        label={'NEXT'}
                        styleWrapper={[styles.btnWrapper, { marginTop: 30 }]}
                    />
                </View>
            </Container>
        );
    }
}

export default ResetPass;
