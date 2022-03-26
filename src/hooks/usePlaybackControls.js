import React from 'react';
import TrackPlayer, {
	usePlaybackState,
	useTrackPlayerProgress,
	TrackPlayerEvents,
	STATE_PLAYING,
} from 'react-native-track-player';

const events = [
	TrackPlayerEvents.PLAYBACK_STATE,
	TrackPlayerEvents.PLAYBACK_ERROR,
];

export const usePlaybackControls = () => {
	const playbackState = usePlaybackState();
	const { position } = useTrackPlayerProgress();

	return {
		setupTrack: item => {
			return setupTrack(item);
		},
		seekForward: seconds => {
			TrackPlayer.seekTo(position + seconds);
		},
		seekBackward: seconds => {
			TrackPlayer.seekTo(position - seconds);
		},
		seekTo: seconds => {
			TrackPlayer.seekTo(seconds);
		},
		playNextTrack: () => {
			TrackPlayer.skipToNext();
		},
		playPreviousTrack: () => {
			if (position > 10) {
				TrackPlayer.seekTo(0);
			} else {
				try {
					TrackPlayer.skipToPrevious();
				} catch (error) {
					console.log('@@@@@ at beginning of queue', error);
				}
			}
		},
		togglePlay: () => {
			if (playbackState === TrackPlayer.STATE_PLAYING) {
				TrackPlayer.pause();
			} else {
				TrackPlayer.play();
			}
		},
		pause: () => {
			TrackPlayer.pause();
		},
		play: () => {
			TrackPlayer.play();
		},
		setRate: rate => {
			TrackPlayer.setRate(rate);
		},
		getRate: async () => {
			return await TrackPlayer.getRate();
		},
		destroy: async () => {
			await TrackPlayer.reset();
			TrackPlayer.destroy();
		},
	};
};

export const setupTrack = async item => {
	const currentTrackId = await TrackPlayer.getCurrentTrack();
	if (!currentTrackId || (currentTrackId && currentTrackId !== item.id)) {
		await TrackPlayer.reset();
		await TrackPlayer.add([item]);
	}
};

export const destroyTrack = async () => {
	await TrackPlayer.reset();
	TrackPlayer.destroy();
};

export const pauseTrack = async () => {
	TrackPlayer.pause();
};

export const usePlayTrackEvent = trackId => {
	const playState = usePlaybackState();
	const [curTrackId, setCurTrackId] = React.useState(null);
	React.useEffect(() => {
		getCurrentTrackId();
	}, [trackId, playState]);

	const getCurrentTrackId = async () => {
		const currentTrack = await TrackPlayer.getCurrentTrack();
		setCurTrackId(currentTrack);
	};

	let isTrackPlaying = false;
	if (curTrackId && trackId) {
		if (curTrackId === trackId) {
			isTrackPlaying = playState === STATE_PLAYING;
		}
	}
	return { isTrackPlaying, curTrackId, playState };
};
