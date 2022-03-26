import React from 'react';
import { View, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { MainContext } from '../../../context';
import NavigationService from '../../../routers/navigation';
import Header from './header';
import Description from './description';
import styles from './styles';
import AudioPlayButton from './audioPlayBtn';
import ProgressBar from '../../progressBar';
import ProgressTime from '../../progressTime';
import { usePlaybackControls, usePlayTrackEvent } from '../../../hooks/usePlaybackControls';

const img_banner = require('../../../assets/images/register/background-club.jpg');

const { width, height } = Dimensions.get('window');


const limitStrLen = 80;

function AudioCard(props) {
    const { item, user, changeAudioTrack, club, onEndRoom } = props;

    const mainContext = React.useContext(MainContext);
    const { updateAudioStatus, allRoom } = mainContext;
    const backgroundSource = item?.photo_url ? { uri: item?.photo_url } : club && club?.voice_photo_url ? { uri: club?.voice_photo_url } : img_banner;
    const user_includs = item.is_allow_all || item.selected_users && item.selected_users.includes(global.currentUser.user_id);

    if (!user_includs) {
        return null;
    }
    const playBackControls = usePlaybackControls();
    const { isTrackPlaying, curTrackId } = usePlayTrackEvent(item.audio_id);

    const onPressPlay = () => {
        if (allRoom) {
            onEndRoom(goToAudioPlayer);
        } else {
            goToAudioPlayer();
        }
    };

    const goToAudioPlayer = () => {
        updateAudioStatus(false);
        NavigationService.navigate('AudioPlayer', { audio: item });
    };

    return (
        <View style={styles.wrapper}>
            <Header audio={item} />
            <TouchableOpacity onPress={onPressPlay}>
                <ImageBackground source={backgroundSource} style={styles.headerContainer}>
                    <AudioPlayButton
                        isTrackPlaying={isTrackPlaying}
                        onPressPlay={onPressPlay} />
                    <View style={styles.playerWrapper}>
                        <ProgressBar
                            isCurrenTrack={item.audio_id === curTrackId}
                            showDes={false} />
                        <View style={{ height: 2, backgroundColor: 'white' }} />
                    </View>
                </ImageBackground>
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 16 }}>
                <ProgressTime
                    isCurrenTrack={item.audio_id === curTrackId}
                    play_duration={item?.audio_duration} />
            </View>
            <Description
                id={item.audio_id}
                likes_gained={item.likes_gained}
                description={item.description}
                isShowLike={true} />
        </View>
    );
}

export default React.memo(AudioCard);