import RtcEngine from 'react-native-agora';
import { AGORA_ID } from './config';
const agoraEngine = null;

export const initRtcEngine = async () => {
	await RtcEngine.create(AGORA_ID);
	await RtcEngine.instance().disableVideo();
	await RtcEngine.instance().setDefaultAudioRoutetoSpeakerphone(false);
	await RtcEngine.instance().enableAudioVolumeIndication(300, 2, true);
	await RtcEngine.instance().adjustPlaybackSignalVolume(300);
	await RtcEngine.instance().adjustAudioMixingVolume(80);
	await RtcEngine.instance().adjustAudioMixingPublishVolume(80);
	await RtcEngine.instance().adjustAudioMixingPlayoutVolume(80);
	await RtcEngine.instance().setAudioProfile(5, 4);
};

export const muteAudio = async muted => {
	RtcEngine.instance().muteLocalAudioStream(muted);
};

export const joinChannel = async (token, channel, uid) => {
	const unSingedUid = uid >>> 0;
	await RtcEngine.instance().joinChannel(token, channel, null, unSingedUid);
};

export const leaveChannel = async () => {
	await RtcEngine.instance()
		.leaveChannel()
		.catch(() => {
			console.log('@@@@@ leave channel error');
		});
};

export const destroy = async () => {
	await RtcEngine.instance().destroy();
};

export const getUnSingedInt = uid => {
	return uid >>> 0;
};
