import TrackPlayer from 'react-native-track-player';
import APIConfig from '../api/const';
import axiosAjax from '../api/axiosConf';
import { normailzeQSData } from '../saga/normalize';
const ENDPOINTS = APIConfig.apiEndpoints;

const trackListeningProgress = async () => {
	let currentState;
	try {
		currentState = await TrackPlayer.getState();
	} catch (error) {
		console.log('@@@@@ error fetching player state', error);
	}
	if (currentState === TrackPlayer.STATE_PLAYING) {
		const position = await TrackPlayer.getPosition();
		const duration = await TrackPlayer.getDuration();
		const trackId = await TrackPlayer.getCurrentTrack();
		if (position + 20 > duration) {
			postTracking(trackId, 0);
		} else {
			postTracking(trackId, position);
		}
	}
};

export const ProgressTrackingService = {
	startTracking: () => {
		setInterval(trackListeningProgress, 7000);
	},
};

const postTracking = async (audio_id, play_time) => {
	await axiosAjax({
		method: 'post',
		url: ENDPOINTS.createAudioTrack(),
		data: normailzeQSData({ audio_id, play_time }),
	});
};
