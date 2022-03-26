import TrackPlayer from 'react-native-track-player';

module.exports = async function() {
	TrackPlayer.addEventListener('remote-play', () => {
		TrackPlayer.play();
	});

	TrackPlayer.addEventListener('remote-pause', () => {
		TrackPlayer.pause();
	});

	TrackPlayer.addEventListener('remote-next', () => {
		TrackPlayer.skipToNext();
	});

	TrackPlayer.addEventListener('remote-previous', () => {
		TrackPlayer.skipToPrevious();
	});

	TrackPlayer.addEventListener('remote-jump-forward', async () => {
		const position = await TrackPlayer.getPosition();
		TrackPlayer.seekTo(position + 15);
	});

	TrackPlayer.addEventListener('remote-jump-backward', async () => {
		const position = await TrackPlayer.getPosition();
		TrackPlayer.seekTo(position - 15);
	});

	TrackPlayer.addEventListener('remote-stop', () => {
		TrackPlayer.destroy();
	});

	TrackPlayer.addEventListener('playback-track-changed', data => {
		console.log('@@@@@ playback-track-changed', data);
	});
};
