import React from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
    Linking,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import constants from '../../styles/const';
import styles from './styles';
import OptionButton from '../../components/buttons/OptionButton';
import { Container, SanityModal, MainButton } from '../../components/index';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';
import { isEmail, showFlashMsg } from '../../helpers/utils';

const ENDPOINTS = APIConfig.apiEndpoints;
const des =
    'BY PROVIDING YOUR MOBILE NUMBER, YOU AGREE THAT IS AMY BE USED TO SEND YOU TEXT MESSAGES AND CALL YOU TO DISCUSS CLUB MEMBERSHIPS THAAT YOU MAY REQUEST.';
const errorAgree =
    'Agreeing to our Privacy Policy and Terms and Conditions is required.';
const errorEmail =
    'Hmm, that doesn’t look like a valid email address. Enter your email address in the format yourname@example.com';
const privacy_link =
    'https://www.notion.so/Privacy-Policy-63e99c1cf3ed4f9c81ae513cf5152dd1';
const terms_link =
    'https://www.notion.so/Terms-of-Use-297d11920bac41a2a3ede5ccb88300e8';

class EnterEmail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loading: false,
            showError: false,
            errMsg: '',
            agreed: true,
        };
    }

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    handleAgree = () => {
        this.setState({
            agreed: !this.state.agreed,
        });
    };

    handleLink = link => {
        const url = link === 'privacy' ? privacy_link : terms_link;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('@@@@@ Don\'t know how to open URI: ' + url);
            }
        });
    };

    onChangeEmail = email => {
        this.setState({ email });
    };

    onEnterEmail = () => {
        const { email, agreed } = this.state;
        if (!isEmail(email.trim())) {
            this.handleModal(errorEmail);
            return;
        }
        if (!agreed) {
            this.handleModal(errorAgree);
            return;
        }
        Keyboard.dismiss();
        this.enterEmailRequest();
    };

    enterEmailRequest = async () => {
        const { email } = this.state;
        const { phone } = this.props.navigation.state.params;
        try {
            this.setState({
                loading: true,
            });
            const { data } = await axiosAjax({
                method: 'patch',
                url: ENDPOINTS.updateVCode(phone),
                data: normailzeQSData({ email: email.trim() }),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                global.currentUser = data.data;
                this.goNext();
            } else {
                this.handleModal(data.data);
            }
        } catch (error) {
            this.setState({
                loading: false,
            });
            showFlashMsg(
                'Failed to send verification code. Please try again',
                true
            );
            console.log('@@@@@ ' + error);
        }
    };

    goNext = () => {
        this.props.navigation.navigate('EnterPassword');
    };

    render() {
        const { showError, errMsg, loading, email, agreed } = this.state;
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
                            <Text style={styles.guide}>ENTER YOUR EMAIL</Text>
                            <Text style={styles.guideDes}>
                                Your email will be your user login.
                            </Text>
                        </View>
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            style={styles.textInputWrapper2}
                            keyboardType={'email-address'}
                            onChangeText={text => this.onChangeEmail(text)}
                            placeholder={'EMAIL'}
                            value={email}
                            autoCapitalize={'none'}
                        />
                    </KeyboardAvoidingView>
                    <View style={styles.checkBoxWrapper}>
                        <OptionButton
                            isChecked={agreed}
                            onPress={() => this.handleAgree()}
                        />
                        <View
                            style={{ marginLeft: 10, alignItems: 'flex-start' }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.comment}>
                                    I HAVE READ AND ACCEPT THE{' '}
                                </Text>
                                <Text
                                    onPress={() => this.handleLink('privacy')}
                                    style={[
                                        styles.comment,
                                        { textDecorationLine: 'underline' },
                                    ]}
                                >
                                    PRIVACY POLICY
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.comment}>AND </Text>
                                <Text
                                    onPress={() => this.handleLink('terms')}
                                    style={[
                                        styles.comment,
                                        { textDecorationLine: 'underline' },
                                    ]}
                                >
                                    TERMS AND CONDITIONS
                                </Text>
                            </View>
                        </View>
                    </View>
                    <MainButton
                        label={'NEXT'}
                        styleWrapper={[styles.btnWrapper, { marginTop: 30 }]}
                        onPress={() => this.onEnterEmail()}
                    />
                </View>
            </Container>
        );
    }
}

export default EnterEmail;
