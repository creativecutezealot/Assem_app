import React from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import constants from '../../styles/const';
import styles from './styles';

import { request as getListByClubIdRequest } from '../../actions/club/getListByClubId';

import {
    Container,
    MainButton,
    SanityModal,
} from '../../components/index';
import Spinner from 'react-native-loading-spinner-overlay';
import AudioRecorder from './recorder';
import Navigation from '../../routers/navigation';

import APIConfig from '../../api/const';
import axiosAjax from '../../api/axiosConf';
import { normailzeQSData } from '../../saga/normalize';

import { showFlashMsg } from '../../helpers/utils';

const ENDPOINTS = APIConfig.apiEndpoints;

const R = require('ramda');

const topicErr = 'Please add a Topic for this Voice Note';
const recordErr = 'Please record a Voice Note.';
const memberErr = 'Please select at least one Member.';
const uploadErr = 'Failed to upload audio';

class CreateVoiceVote extends React.PureComponent {
    // static navigationOptions = ({ navigation, props }) => ({
    //     headerMode: "none"
    // });
    constructor(props) {
        super(props);
        this.state = {
            audio_url: '',
            description: '',
            audio_duration: 0,
            audio_file_name: '',
            loading: false,
            showError: false,
            errMsg: '',
            inputHeight: 100,
        };
        this.recorderRef = React.createRef();
    }

    onChangeURI = async (audio_url, audio_file_name) => {
        this.setState({
            audio_file_name,
            audio_url,
        });
    };

    createAudio = async () => {
        const {
            audio_url,
            description,
            audio_file_name,
            audio_duration,
        } = this.state;
        const { club } = this.props;
        const { id: receiver_id } = this.props.navigation.state.params;
        if (audio_url == '' || audio_file_name == '') {
            this.handleError(recordErr);
            return;
        }
        const payload = {
            audio_duration,
            audio_file_name,
            audio_url,
            receiver_id,
            description,
            enter_club_id: club.club_id,
            enter_club_name: club.club_name,
            host_name: `${global.currentUser.first_name} ${
                global.currentUser.last_name
            }`,
        };
        console.log('@@@@@ payload', payload);
        this.setState({
            loading: true,
        });
        try {
            const { data } = await axiosAjax({
                method: 'post',
                url: ENDPOINTS.createVoiceNote(),
                data: normailzeQSData(payload),
            });
            this.setState({
                loading: false,
            });
            if (data.status) {
                this.resetRecorder();
                this.props.getListByClubIdRequest({ id: club.club_id });
                this.onGoBack();
            } else {
                this.handleError(data.data);
            }
        } catch (error) {
            console.log('@@@@@ ' + error);
            this.setState({
                loading: false,
            });
            showFlashMsg('Failed to create voice note. Please try again', true);
        }
    };

    resetRecorder = () => {
        this.setState({
            audio_url: '',
            audio_file_name: '',
            audio_duration: 0,
        });
        if (this.recorderRef && this.recorderRef.current) {
            this.recorderRef.current.onStopRecord();
            this.recorderRef.current.onStopPlay();
        }
    };

    onGoBack = () => {
        Navigation.back();
    };

    handleError = (errMsg = '') => {
        this.setState({
            errMsg,
            showError: !this.state.showError,
        });
    };

    onChangeInput = (key, text) => {
        this.setState({ [key]: text });
    };

    render() {
        const { loading, showError, errMsg, audio_url } = this.state;
        return (
            <Container
                title="MESSAGE"
                scrollEnabled={true}
                onBackPress={this.onGoBack}
                isHome={true}
            >
                <View style={styles.container}>
                    <SanityModal
                        show={showError}
                        msg={errMsg}
                        onCancel={() => {
                            this.handleError();
                        }}
                        onConfirm={() => {
                            this.handleError();
                        }}
                    />
                    <KeyboardAvoidingView
                        style={{ flex: 1, width: '100%', alignItems: 'center' }}
                    >
                        <Text
                            style={[
                                styles.guideDes,
                                {
                                    fontSize: 18,
                                    textAlign: 'center',
                                    marginTop: 10,
                                },
                            ]}
                        >
                            VoiceNote
                        </Text>
                        <View style={[styles.itemContainer, { marginTop: 0 }]}>
                            <AudioRecorder
                                ref={this.recorderRef}
                                audio_url={audio_url}
                                onChangeURI={this.onChangeURI}
                                handleError={this.handleError}
                                onChangeDuration={duration => {
                                    this.setState({
                                        audio_duration: Math.floor(duration),
                                    });
                                }}
                            />
                        </View>
                        <View style={styles.itemContainer}>
                            <Text
                                style={[
                                    styles.guideDes,
                                    { fontSize: 18, textAlign: 'center' },
                                ]}
                            >
                                {'Text (optional)'}
                            </Text>
                            <TextInput
                                placeholderTextColor={
                                    constants.colors.placeholder
                                }
                                value={this.state.description}
                                style={[
                                    styles.textInputWrapper,
                                    {
                                        height: Math.max(
                                            100,
                                            this.state.inputHeight
                                        ),
                                        paddingVertical: 10,
                                    },
                                ]}
                                multiline={true}
                                maxLength={1000}
                                onChangeText={text =>
                                    this.onChangeInput('description', text)
                                }
                                placeholder={'TEXT'}
                                onContentSizeChange={e => {
                                    this.setState({
                                        inputHeight:
                                            e.nativeEvent.contentSize.height +
                                            30,
                                    });
                                }}
                            />
                        </View>
                        <MainButton
                            onPress={() => this.createAudio()}
                            label={'SEND MESSAGE'}
                            styleWrapper={[
                                styles.btnWrapper,
                                { marginTop: 44 },
                            ]}
                        />
                    </KeyboardAvoidingView>
                    <Spinner visible={loading} />
                </View>
            </Container>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        club: state.currentClub.data,
        audio: state.audioPOST.data ? state.audioPOST.data.data : null,
        error: state.audioPOST.error,
        loading: state.audioPOST.loading,
    };
};

const mapDispatchToProps = {
    getListByClubIdRequest,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateVoiceVote);
