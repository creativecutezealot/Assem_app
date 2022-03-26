import React from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from './styles';
import { Container, MainButton, SanityModal } from '../../components/index';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

import { showFlashMsg } from '../../helpers/utils';

const ENDPOINTS = APIConfig.apiEndpoints;
const errorAge = 'Members must be greater than 18 years of age.';

class EnterBirth extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            date: moment().format('YYYY-MM-DD'),
            showDatePicker: false,
            loading: false,
            showError: false,
            errMsg: '',
        };
    }

    handleShowDatePicker = () => {
        this.setState({
            showDatePicker: !this.state.showDatePicker,
        });
    };

    handleChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        this.setState({
            showDatePicker: false,
            date: moment(currentDate).format('YYYY-MM-DD'),
            currentDate,
        });
    };

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    onUpdateBrith = () => {
        const { date } = this.state;
        if (!this.onValidateAge()) {
            this.handleModal(errorAge);
            return;
        }
        this.setState({
            loading: true,
        });
        this.updateAge();
    };

    onValidateAge = () => {
        this.setState({
            showDatePicker: false,
        });
        const { date } = this.state;
        if (date === '') {
            return false;
        }
        const currentDate = new Date().getTime() / 1000;
        const chooseDate = new Date(date).getTime() / 1000;
        const age = (currentDate - chooseDate) / (3600 * 24 * 365);
        if (age >= 18) {
            return true;
        }
        return false;
    };

    updateAge = async () => {
        const { date } = this.state;
        const user = global.currentUser;
        try {
            const { data } = await axiosAjax({
                method: 'patch',
                url: ENDPOINTS.updateUser(),
                data: normailzeQSData({ birth: date }),
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
            console.log('@@@@@ ' + error);
            showFlashMsg('Failed to update user info. Please try again', true);
        }
    };

    goNext = () => {
        this.props.navigation.navigate('EnterProfessional');
    };

    render() {
        const {
            loading,
            showError,
            errMsg,
            date,
            showDatePicker,
            currentDate,
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
                            <Text style={styles.guide}>ADD YOUR BIRTHDAY</Text>
                            <Text style={styles.guideDes}>
                                {'This won\'t be part of\nyour public profile'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.datePickerWrapper}
                            onPress={this.handleShowDatePicker}
                        >
                            <Text style={styles.dateTxt}>{date}</Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            display="spinner"
                            testID="dateTimePicker"
                            value={currentDate}
                            mode={'date'}
                            minimumDate={new Date(1901, 0, 1)}
                            onChange={this.handleChangeDate}
                            textColor={'white'}
                        />
                    </KeyboardAvoidingView>

                    <MainButton
                        onPress={() => this.onUpdateBrith()}
                        label={'NEXT'}
                        styleWrapper={[styles.btnWrapper, { marginTop: 30 }]}
                    />
                </View>
            </Container>
        );
    }
}

export default EnterBirth;
