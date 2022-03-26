import React, { useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import { Player } from '@react-native-community/audio-toolkit';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5Pro';
import Spinner from 'react-native-loading-spinner-overlay';

import { SeekBar } from '../../components/index';
import { mmssss } from '../../helpers/utils';
import styles from './styles';

const { width, height } = Dimensions.get('window');

export default function AudioPlayer({ url }) {
    const [playing, setPlaying] = useState(true);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [disabled, setDisabeld] = useState(true);

    const updateState = player => {
        if (!player) {
            return;
        }
        setPlaying(player && player.isPlaying ? true : false);
        setDisabeld(!player || !player.canPlay);
    };

    const player = React.useMemo(() => {
        const player = new Player(url, {
            autoDestroy: false,
        }).prepare(err => {
            updateState(player);
        });
        updateState(player);
        return player;
    }, [url]);

    React.useEffect(() => {
        if (!player) {
            return;
        }
        const subScription = player.on('ended', () => {
            updateState(player);
        });
        return () => {
            player.destroy();
        };
    }, [player]);

    React.useEffect(() => {
        if (!player) {
            return;
        }
        const subScription = player.on('pause', () => {
            updateState(player);
        });
        return () => {
            player.destroy();
        };
    }, [player]);

    React.useEffect(() => {
        if (!player) {
            return;
        }
        const progressInterval = setInterval(() => {
            if (player) {
                let progress = Math.max(0, player.currentTime);
                if (isNaN(progress)) {
                    progress = 0;
                }
                setProgress(progress);
                setDuration(player.duration);
            }
        }, 100);

        return () => {
            clearInterval(progressInterval);
        };
    }, [player]);

    const playPause = React.useCallback(() => {
        if (!player) {
            return;
        }
        player.playPause((err, paused) => {
            updateState(player);
        });
    }, [player]);

    const stop = React.useCallback(() => {
        if (!player) {
            return;
        }
        player.stop(() => {
            updateState(player);
        });
    }, [player]);

    const seekTo = React.useCallback(
        position => {
            if (!player) {
                return;
            }
            player.seek(position, () => {
                updateState(player);
            });
        },
        [player]
    );

    return (
        <View style={{ width: width, justifyContent: 'center' }}>
            <Spinner visible={disabled} />
            <SeekBar
                min={0}
                max={duration}
                progress={progress}
                progressHeight={12}
                progressBackgroundColor="#FFFFFF00"
                progressColor="#FFFFFF"
                thumbSize={12}
                thumbColor="#FFFFFF"
                thumbColorPressed="#FFFFFF"
                onProgressChanged={progress => seekTo(progress)}
            />
            <View style={{ height: 2, backgroundColor: 'white' }} />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    marginTop: 8,
                }}
            >
                <Text style={styles.textState}>
                    {progress <= 0 ? '00:00' : mmssss(progress)}
                </Text>
                <Text style={styles.textState}>
                    {duration <= 0 ? '00:00' : mmssss(duration)}
                </Text>
            </View>

            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 16,
                }}
            >
                <TouchableOpacity onPress={playPause}>
                    <FontAwesome5
                        name={!playing ? 'play-circle' : 'pause-circle'}
                        style={{ color: 'white', fontSize: 84 }}
                        light
                    />
                    <Text style={styles.textPlay}>
                        {!playing ? 'Play' : 'Pause'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
