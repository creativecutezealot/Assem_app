import React from 'react';
import { View, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { MainContext } from '../../../context';
import Header from './header';
import styles from './styles';
import NavigationService from '../../../routers/navigation';
import { usePlaybackControls, usePlayTrackEvent } from '../../../hooks/usePlaybackControls';
import AudioPlayButton from '../AudioCard/audioPlayBtn';
import Description from '../AudioCard/description';
import ProgressBar from '../../progressBar';
import ProgressTime from '../../progressTime';
import Actions from './actions';

const img_banner = require('../../../assets/images/register/background-club.jpg');

const { width, height } = Dimensions.get('window');

const limitStrLen = 80;

function VoiceCard(props) {
	const { item, club, onRefresh, onEndRoom } = props;
	const [loading, setLoading] = React.useState(false);
	const mainContext = React.useContext(MainContext);
	const playBackControls = usePlaybackControls();
	const { isTrackPlaying, curTrackId } = usePlayTrackEvent(item.voicenote_id);

	const { allRoom, updateAudioStatus, updateCurrentAudio } = mainContext;

	let backgroundSource = '';
	if (item.audio_obj && item.audio_obj.photo_url !== '') {
		backgroundSource = { uri: item.audio_obj.photo_url };
	} else {
		if (club && club.voice_photo_url !== '') {
			backgroundSource = { uri: club.voice_photo_url };
		} else {
			backgroundSource = img_banner;
		}
	}
	let description = '';
	if (item.audio_obj && item.audio_obj.description !== '') {
		description = item.audio_obj.description;
	} else if (item.description !== '') {
		description = item.description;
	}

	let play_duration = '';
	if (item.audio_obj && item.audio_obj.play_duration !== '') {
		play_duration = item.audio_obj.audio_duration;
	} else if (item.audio_duration !== '') {
		play_duration = item.audio_duration;
	}
	const user_includs = item.receiver_id === global.currentUser.user_id;

	if (!user_includs) {
		return null;
	}

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
			<Header voice={item} />
			<TouchableOpacity onPress={onPressPlay}>
				<ImageBackground source={backgroundSource} style={styles.headerContainer}>
					<AudioPlayButton
						isTrackPlaying={isTrackPlaying}
						onPressPlay={onPressPlay} />
					<View style={styles.playerWrapper}>
						<ProgressBar
							isCurrenTrack={item.voicenote_id === curTrackId}
							showDes={false} />
						<View style={{ height: 2, backgroundColor: 'white' }} />
					</View>
				</ImageBackground>
			</TouchableOpacity>
			<View style={{ paddingHorizontal: 16 }}>
				<ProgressTime
					isCurrenTrack={item.voicenote_id === curTrackId}
					play_duration={play_duration} />
			</View>
			<Description id={item.voicenote_id} description={description} isShowLike={false} />
			<Actions item={item} onRefresh={onRefresh} />
			<Spinner visible={loading} />
		</View>
	);
}

export default React.memo(VoiceCard);