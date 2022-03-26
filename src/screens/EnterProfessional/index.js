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
import { Container, MainButton, SanityModal } from '../../components/index';
import { isFullName, showFlashMsg } from '../../helpers/utils';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

const ENDPOINTS = APIConfig.apiEndpoints;

const errorBio = 'Please tell us more about yourself by entering a short bio';
const errorJob =
    'Please tell us more about yourself by entering your most Recent Job Title';
const errorCompany =
    'Please tell us more about yourself by entering your most Recent Company';
const errorIndustry =
    'Please tell us more about yourself by entering the Industry you work in';
class EnterProfessional extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
    };
    constructor(props) {
        super(props);
        this.state = {
            short_bio: '',
            job: '',
            company: '',
            industry: '',
            loading: false,
            showError: false,
            errMsg: '',
            inputHeight: 56,
        };
    }

    handleModal = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    onChangeBio = short_bio => {
        this.setState({ short_bio });
    };
    onChangeJob = job => {
        this.setState({ job });
    };
    onChangeCompany = company => {
        this.setState({ company });
    };

    onChangeIndustry = industry => {
        this.setState({ industry });
    };

    onUpdate = () => {
        const { short_bio, job, company, industry } = this.state;
        if (!isFullName(short_bio)) {
            this.handleModal(errorBio);
            return;
        }

        if (!isFullName(job)) {
            this.handleModal(errorJob);
            return;
        }

        if (!isFullName(company)) {
            this.handleModal(errorCompany);
            return;
        }

        // if (!isFullName(industry)) {
        //     this.handleModal(errorIndustry);
        //     return;
        // }

        Keyboard.dismiss();
        this.setState({
            loading: true,
        });
        this.update();
    };

    update = async () => {
        const { short_bio, job, company, industry } = this.state;
        const user = global.currentUser;
        try {
            const { data } = await axiosAjax({
                method: 'patch',
                url: ENDPOINTS.updateUser(),
                data: normailzeQSData({ short_bio, job, company, industry }),
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
        this.props.navigation.navigate('EnterPhoto');
    };

    render() {
        const { loading, showError, errMsg, inputHeight } = this.state;
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
                            <Text style={styles.guide}>COMPLETE A PROFILE</Text>
                            <Text style={styles.guideDes}>
                                {
                                    'Tell us about yourself and your\nprefessional profile'
                                }
                            </Text>
                        </View>
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            value={this.state.text1}
                            style={[
                                styles.textInputWrapper1,
                                {
                                    height: Math.max(56, inputHeight),
                                    paddingVertical: 10,
                                },
                            ]}
                            multiline={true}
                            maxLength={500}
                            onChangeText={text => this.onChangeBio(text)}
                            placeholder={'BIO'}
                            onContentSizeChange={e => {
                                this.setState({
                                    inputHeight:
                                        e.nativeEvent.contentSize.height + 30,
                                });
                            }}
                        />
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            value={this.state.text1}
                            style={styles.textInputWrapper1}
                            onChangeText={text => this.onChangeJob(text)}
                            placeholder={'MOST RECENT JOB TITLE'}
                        />
                        <TextInput
                            placeholderTextColor={constants.colors.placeholder}
                            value={this.state.text2}
                            style={styles.textInputWrapper2}
                            onChangeText={text => this.onChangeCompany(text)}
                            placeholder={'MOST RECENT COMPANY'}
                        />
                    </KeyboardAvoidingView>
                    <MainButton
                        label={'NEXT'}
                        styleWrapper={[styles.btnWrapper, { marginTop: 30 }]}
                        onPress={() => this.onUpdate()}
                    />
                </View>
            </Container>
        );
    }
}

export default EnterProfessional;
