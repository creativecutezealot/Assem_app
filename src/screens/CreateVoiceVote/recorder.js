import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import TrackPlayler, { STATE_PLAYING } from 'react-native-track-player';
import WaveForm from 'react-native-audiowaveform';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import Spinner from 'react-native-loading-spinner-overlay';
import { RNS3 } from 'react-native-s3-upload';
import { Player } from '@react-native-community/audio-toolkit';
import {
    AWS_REGION,
    AWS_ACCESSKEY,
    AWS_SECRETKEY,
    cdnlink_audio,
} from '../../helpers/config';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5Pro';
import { checkRecordPermission, mmssss } from '../../helpers/utils';
import constants from '../../styles/const';

const limitation = 180 * 1000;

export default class AudioRecorder extends PureComponent {
    player = null;
    _progressInterval = null;
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isRecording: false,
            isPlaying: false,
            recordSecs: 0,
            disabled: true,
            recordTime: '00:00',
            playTime: '00:00',
            duration: '00:00',
            url: '',
            filename: 'futureof_record',
        };

        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
    }

    componentDidMount() {
        checkRecordPermission();
        this.currentTrackPause();
        this._progressInterval = setInterval(() => {
            if (this.player) {
                let progress = Math.max(0, this.player.currentTime);
                if (isNaN(progress)) {
                    progress = 0;
                }
                this.setState({
                    playTime: mmssss(Math.floor(progress)),
                    duration:
                        this.player.duration > 0
                            ? mmssss(Math.floor(this.player.duration))
                            : '00:00',
                });
            }
        }, 100);
    }

    componentWillUnmount() {
        this.audioRecorderPlayer.removePlayBackListener();
        this.audioRecorderPlayer.removeRecordBackListener();
    }

    currentTrackPause = async () => {
        const currentTrack = await TrackPlayler.getCurrentTrack();
        if (currentTrack) {
            const currentState = await TrackPlayler.getState();
            if (currentState === STATE_PLAYING) {
                TrackPlayler.pause();
            }
        }
    };

    onStartRecord = async () => {
        await this.setState({
            filename: new Date().getTime(),
            playTime: '00:00',
            duration: '00:00',
        });
        const path = Platform.select({
            ios: `${this.state.filename}.m4a`,
            android: `sdcard/${this.state.filename}.mp4`,
        });
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.max,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        const uri = await this.audioRecorderPlayer.startRecorder(
            path,
            false,
            audioSet
        );
        this.setState({ url: uri, isRecording: true });
        this.audioRecorderPlayer.addRecordBackListener(e => {
            if (e.current_position >= limitation) {
                this.onStopRecord();
            }
            this.props.onChangeDuration(e.current_position);
            this.setState({
                recordSecs: e.current_position,
                recordTime: mmssss(Math.floor(e.current_position)),
            });
        });
    };

    onStopRecord = async () => {
        const result = await this.audioRecorderPlayer.stopRecorder();
        this.audioRecorderPlayer.removeRecordBackListener();
        this.setState({
            recordSecs: 0,
            isRecording: false,
        });
        const audio_cdn_url = await this.uploadAudio(
            this.state.filename,
            this.state.url
        );
        this.props.onChangeURI(audio_cdn_url, this.state.filename);
        this._reloadPlayer(audio_cdn_url);
    };

    onPausePlay = async () => {
        this.player.playPause((err, paused) => {
            if (err) {
                this.setState({
                    error: err.message,
                });
            }
            this._updateState();
        });
    };

    onStopPlay = async () => {
        this.player.stop(() => {
            this._updateState();
        });
    };

    _updateState = err => {
        this.setState({
            isPlaying: this.player && this.player.isPlaying ? true : false,
            disabled: !this.player || !this.player.canPlay,
        });
    };

    _reloadPlayer = url => {
        if (this.player) {
            this.player.destroy();
        }
        this.player = new Player(url, {
            autoDestroy: false,
        }).prepare(err => {
            console.log('@@@@@ ' + err);
            this._updateState();
        });
        this._updateState();
        this.player.on('ended', () => {
            this._updateState();
        });
        this.player.on('pause', () => {
            this._updateState();
        });
    };

    uploadAudio = async (name, uri) => {
        const filename = Platform.select({
            ios: `${name}.m4a`,
            android: `${name}.mp4`,
        });
        const filetype = Platform.select({
            ios: 'audio/m4a',
            android: 'audio/mp4',
        });
        const file = {
            uri,
            name: filename,
            type: filetype,
        };
        const uploadoptions = {
            keyPrefix: 'uploads/',
            bucket: 'futureof',
            region: AWS_REGION,
            accessKey: AWS_ACCESSKEY,
            secretKey: AWS_SECRETKEY,
            successActionStatus: 201,
        };
        this.setState({ loading: true });
        try {
            const res = await RNS3.put(file, uploadoptions);
            this.setState({ loading: false });
            if (res.status === 201) {
                const uriAws = res.body
                    ? `${cdnlink_audio}${res.body.postResponse.key}`
                    : '';
                this.setState({ audio_url: uriAws });
                return uriAws;
            } else {
                return '';
            }
        } catch (error) {
            this.setState({ loading: false });
            return '';
        }
    };

    render() {
        const { disabled, loading } = this.state;
        return (
            <View style={styles.viewPlayer}>
                <Text style={styles.txtRecordCounter}>
                    {this.state.recordTime}
                </Text>
                <View style={styles.waveFormContainer}>
                    {!this.state.isRecording && this.state.url != '' && (
                        <WaveForm
                            autoPlay={false}
                            style={{ flex: 1 }}
                            source={{ uri: this.state.url }}
                            play={this.state.isPlaying}
                            onFinishPlay={() => {
                                this.setState({
                                    isPlaying: false,
                                });
                            }}
                            waveFormStyle={{
                                waveColor: 'red',
                                scrubColor: 'white',
                            }}
                        />
                    )}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '80%',
                        marginVertical: 20,
                    }}
                >
                    <Text style={styles.txtCounter}>{this.state.playTime}</Text>
                    <Text style={styles.txtCounter}>{this.state.duration}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        disabled={this.state.isPlaying}
                        activeOpacity={1}
                        onPress={
                            this.state.isRecording
                                ? this.onStopRecord
                                : this.onStartRecord
                        }
                    >
                        <FontAwesome5
                            name={
                                this.state.isRecording
                                    ? 'stop-circle'
                                    : 'record-vinyl'
                            }
                            style={
                                this.state.isPlaying
                                    ? styles.disableIcon
                                    : styles.recordIcon
                            }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={this.state.isRecording && disabled}
                        activeOpacity={1}
                        onPress={this.onPausePlay}
                    >
                        <FontAwesome5
                            name={
                                !disabled && this.state.isPlaying
                                    ? 'pause-circle'
                                    : 'play-circle'
                            }
                            style={
                                this.state.isRecording
                                    ? styles.disableIcon
                                    : styles.playIcon
                            }
                            light
                        />
                    </TouchableOpacity>
                </View>
                <Spinner visible={loading} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    waveFormContainer: {
        width: '80%',
        height: 80,
        marginVertical: 30,
        borderLeftColor: 'white',
        borderLeftWidth: 2,
        borderRightColor: 'white',
        borderRightWidth: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        marginVertical: 16,
    },
    recordBtnWrapper: {
        flexDirection: 'row',
    },
    viewPlayer: {
        marginTop: 30,
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    txtRecordCounter: {
        color: 'white',
        fontSize: 32,
        textAlignVertical: 'center',
        fontFamily: constants.fonts.sweetSans,
        letterSpacing: 1,
    },
    txtCounter: {
        color: 'white',
        fontSize: 12,
        textAlignVertical: 'center',
        fontFamily: constants.fonts.sweetSans,
    },
    playIcon: { color: 'white', fontSize: 64 },
    disableIcon: { color: 'grey', fontSize: 64 },
    recordIcon: { color: 'red', fontSize: 64 },
});
