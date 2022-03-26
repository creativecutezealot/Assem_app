import React, {
    useContext,
    useState,
} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import TrackPlayer from 'react-native-track-player';
import styles from './styles';
import { MainContext } from '../../context';
import {
    usePlaybackControls,
    usePlayTrackEvent,
} from '../../hooks/usePlaybackControls';
import { ActionBtns } from '../../components/index';

function BottomActions(props) {
    const { containerStyle = {} } = props;
    const mainContext = useContext(MainContext);
    const { currentAudio, allAudio, updateCurrentAudio, toggleSortType } = mainContext;
    const [mounted, setMounted] = useState(false);
    const playBackControls = usePlaybackControls();

    React.useEffect(() => {
        if (currentAudio && currentAudio.id !== '') {
            setUpCurrentTrack();
        }
        const subScription = TrackPlayer.addEventListener(
            'playback-queue-ended',
            async track => {
                // The android version of rn-track-player will fire this event after every
                // manual track change (i.e. when a new queue gets created)
                // checking the track value to work around this bug
                if (!track.nextTrack && track.track) {
                    const currentTrack = await TrackPlayer.getTrack(
                        track.track
                    );
                    if (currentTrack) {
                        updateCurrentAudio(null);
                        playBackControls.destroy();
                    }
                }
                console.log('@@@@@ in playback-queue-ended', track);
            }
        );
        return () => {
            subScription.remove();
        };
    }, [currentAudio]);

    const setUpCurrentTrack = async () => {
        const currenTrack = await TrackPlayer.getCurrentTrack();
        setMounted(true);
    };

    const onPlayPause = () => {
        playBackControls.togglePlay();
    };

    const seekForward = () => {
        playBackControls.seekForward(15);
    };

    const seekBackward = () => {
        playBackControls.seekBackward(15);
    };

    const { isTrackPlaying, playState } = usePlayTrackEvent(currentAudio?.id);

    return (
        <View
            style={[
                styles.footerWrapper,
                allAudio && styles.footerAllAudioWrapper,
            ]}
        >
            <TouchableOpacity
                disabled={!mounted}
                onPress={seekBackward}
                style={styles.seekIconContainer}
            >
                <FontAwesome5Pro name={'undo'} style={styles.seekIcon} light />
                <Text style={styles.seekText}>15</Text>
            </TouchableOpacity>
            <TouchableOpacity
                disabled={!mounted}
                style={{ marginHorizontal: 36 }}
                onPress={onPlayPause}
            >
                <FontAwesome5Pro
                    name={isTrackPlaying ? 'pause-circle' : 'play-circle'}
                    style={styles.playIcon}
                    light
                />
            </TouchableOpacity>
            <TouchableOpacity
                disabled={!mounted}
                onPress={seekForward}
                style={styles.seekIconContainer}
            >
                <FontAwesome5Pro name={'redo'} style={styles.seekIcon} light />
                <Text style={styles.seekText}>15</Text>
            </TouchableOpacity>
            <ActionBtns toggleSortType={toggleSortType} />
        </View>
    );
}
export default BottomActions;
