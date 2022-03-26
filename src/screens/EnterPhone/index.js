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
import CountryPicker, {
    DARK_THEME,
} from 'react-native-country-picker-modal';

import { showFlashMsg } from '../../helpers/utils';


import { Container, SanityModal, MainButton } from '../../components/index';
import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

const libPhoneNumber = require('google-libphonenumber');
const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();
const ENDPOINTS = APIConfig.apiEndpoints;
const des =
    'BY PROVIDING YOUR MOBILE NUMBER, YOU AGREE THAT IT MAY BE USED TO SEND YOU TEXT MESSAGES AND TO CALL YOU REGARDING CLUB MEMBERSHIPS.';
const errorMsg =
    'Hmm, the phone number looks incorrect. Please enter a valid phone number';
class EnterPhone extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cca2: 'US',
            callingCode: '1',
            phoneNumber: '',
            loading: false,
            showError: false,
            errMsg: '',
            visibleCountryPicker: false,
        };
    }

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    onChangePhoneNumber = phoneNumber => {
        this.setState({ phoneNumber });
    };

    handleCountryCode = (country) => {
        this.setState({
            cca2: country.cca2,
            callingCode: country.callingCode,
            visibleCountryPicker: false,
            phoneNumber: '',
        });
    };

    onEnterPhone = () => {
        const { phoneNumber, cca2, callingCode } = this.state;
        if (
            callingCode == '' ||
            phoneNumber.length < 5 ||
            !phoneUtil.isValidNumberForRegion(
                phoneUtil.parse(phoneNumber, cca2),
                cca2
            )
        ) {
            this.handleModal(errorMsg);
            return;
        }
        Keyboard.dismiss();
        this.enterPhoneRequest();
    };

    enterPhoneRequest = async () => {
        const { phoneNumber, callingCode } = this.state;
        try {
            this.setState({
                loading: true,
            });
            const { data } = await axiosAjax({
                method: 'post',
                url: ENDPOINTS.postVCode(),
                data: normailzeQSData({
                    phone: `${callingCode}${phoneNumber}`,
                }),
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
            showFlashMsg(
                'Failed to send verification code. Please try again',
                true
            );
        }
    };

    goVerify = () => {
        const { phoneNumber, callingCode } = this.state;
        this.props.navigation.navigate('ConfirmPhoneCode', {
            phone: `${callingCode}${phoneNumber}`,
        });
    };

    render() {
        const {
            cca2,
            callingCode,
            showError,
            errMsg,
            loading,
            phoneNumber,
            visibleCountryPicker,
        } = this.state;
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
                            <Text style={styles.guide}>ENTER PHONE NUMBER</Text>
                            <Text style={styles.guideDes}>
                                We will text you a verification code.
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <CountryPicker
                                withAlphaFilter={true}
                                withFilter={true}
                                withCallingCode={true}
                                withModal={true}
                                withCloseButton={true}
                                withEmoji={true}
                                theme={DARK_THEME}
                                visible={visibleCountryPicker}
                                placeholder={`${cca2} +${callingCode}`}
                                onSelect={this.handleCountryCode}
                            />
                            <TextInput
                                placeholderTextColor={
                                    constants.colors.placeholder
                                }
                                style={styles.textInputWrapper}
                                onChangeText={text =>
                                    this.onChangePhoneNumber(text)
                                }
                                placeholder={''}
                                maxLength={15}
                                keyboardType={'phone-pad'}
                                value={phoneNumber}
                            />
                        </View>
                    </KeyboardAvoidingView>
                    <MainButton
                        label={'NEXT'}
                        styleWrapper={[styles.btnWrapper, { marginTop: 30 }]}
                        onPress={() => this.onEnterPhone()}
                    />
                    <View style={styles.textWrapper}>
                        <Text style={styles.comment}>{des}</Text>
                    </View>
                </View>
            </Container>
        );
    }
}

export default EnterPhone;
