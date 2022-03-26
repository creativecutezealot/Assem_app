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
import { isFullName, showFlashMsg } from '../../helpers/utils';
import { Container, MainButton, SanityModal } from '../../components/index';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

const ENDPOINTS = APIConfig.apiEndpoints;
const errorFirstName =
    'Hmm, that does not look like a valid First Name. Please re-enter';
const errorLastName =
    'Hmm, that does not look like a valid Last Name. Please re-enter.';
class EnterName extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            loading: false,
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

    onChangeFirstName = firstName => {
        this.setState({ firstName });
    };

    onChangeLastName = lastName => {
        this.setState({ lastName });
    };

    onUpdateName = () => {
        const { firstName, lastName } = this.state;
        if (!isFullName(firstName)) {
            this.handleModal(errorFirstName);
            return;
        }

        if (!isFullName(lastName)) {
            this.handleModal(errorLastName);
            return;
        }

        Keyboard.dismiss();
        this.setState({
            loading: true,
        });
        this.updateName();
    };

    updateName = async () => {
        const { firstName, lastName } = this.state;
        const user = global.currentUser;
        try {
            const { data } = await axiosAjax({
                method: 'patch',
                url: ENDPOINTS.updateUser(),
                data: normailzeQSData({
                    first_name: firstName,
                    last_name: lastName,
                }),
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
            showFlashMsg('Failed to update user name. Please try again', true);
        }
    };

    goNext = () => {
        this.props.navigation.navigate('EnterLocation');
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
                            <Text style={styles.guide}>ADD YOUR NAME</Text>
                            <Text style={styles.guideDes}>
                                {
                                    'Add your name so other\nMemebers can find you'
                                }
                            </Text>
                        </View>
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            style={styles.textInputWrapper1}
                            onChangeText={text => this.onChangeFirstName(text)}
                            placeholder={'FIRST NAME'}
                            value={this.state.firstName}
                        />
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            style={styles.textInputWrapper2}
                            onChangeText={text => this.onChangeLastName(text)}
                            placeholder={'LAST NAME'}
                            value={this.state.lastName}
                        />
                    </KeyboardAvoidingView>
                    <MainButton
                        onPress={() => this.onUpdateName()}
                        label={'NEXT'}
                        styleWrapper={[styles.btnWrapper, { marginTop: 30 }]}
                    />
                </View>
            </Container>
        );
    }
}

export default EnterName;
