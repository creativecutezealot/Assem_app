import React from 'react';
import { View, Text } from 'react-native';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { mmssss } from '../../helpers/utils';
import styles from './styles';

export default class ProgressTime extends ProgressComponent {
    seekToAudio = progress => {
        const { duration } = this.state;
        const seekPosition = (progress / 100) * duration;
        TrackPlayer.seekTo(seekPosition);
    };
    render() {
        const {
            isCurrenTrack,
            containerStyle = {},
            play_duration,
        } = this.props;
        const { position, duration } = this.state;
        if (!isCurrenTrack) {
            return (
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 8,
                        },
                        { containerStyle },
                    ]}
                >
                    <Text style={styles.textState}>00:00</Text>
                    <Text style={styles.textState}>
                        {!play_duration || play_duration <= 0
                            ? '00:00'
                            : mmssss(play_duration)}
                    </Text>
                </View>
            );
        }
        return (
            <View
                style={[
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 8,
                    },
                    { containerStyle },
                ]}
            >
                <Text style={styles.textState}>
                    {!position || position <= 0
                        ? '00:00'
                        : mmssss(position * 1000)}
                </Text>
                <Text style={styles.textState}>
                    {!duration || duration <= 0
                        ? '00:00'
                        : mmssss(duration * 1000)}
                </Text>
            </View>
        );
    }
}
