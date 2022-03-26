import { API_ENDPOINT } from '../helpers/config';

export default {
	apiSite: API_ENDPOINT,
	apiEndpoints: {
		//Activation
		postACode: () => 'acode',
		getACode: code => `acode/${code}`,

		// Verification
		postVCode: () => 'vcode',
		getVCode: code => `vcode/${code}`,
		updateVCode: phone => `vcode/${phone}`,

		// Auth
		login: () => 'auth/login',
		updatePass: id => `auth/updatepass/${id}`,
		updateUser: () => 'auth/update',
		forgotPass: () => 'auth/forgotpass',
		resetPass: () => 'auth/confirmcodepass',

		// User
		getUser: id => `user/${id}`,
		getUsers: () => 'users',
		connectUser: () => 'connect/user',
		delConnectUser: (id, club_id) => `connect/user/${id}/${club_id}`,
		connectUserWithId: (id, club_id) => `connect/users/${id}/${club_id}`,
		connectUsers: (id, club_id) => `connect/users/${id}/${club_id}`,
		connectFollowUsers: (id, club_id) =>
			`connect/users/opposite/${id}/${club_id}`,
		createUserLike: () => 'user/like',
		getUserLike: id => `user/like/${id}`,
		createUserConnectClub: () => 'user/connect/club',
		/// Assemble
		getAssemble: id => `assemble/${id}`,
		getAssembles: () => 'assembles',
		createAssemble: () => 'assemble/mobile',
		updateAssemble: id => `assemble/${id}`,
		deleteAssemble: id => `assemble/${id}`,
		createAssembleLike: () => 'assemble/like',
		getAssembleLike: id => `assemble/like/${id}`,
		notifyAssemble: id => `notify/${id}`,
		endAssemble: id => `endassemble/${id}`,

		/// Audio
		getAudio: id => `audio/${id}`,
		getAudios: () => 'audios',
		createAudio: () => 'audio/mobile',
		updateAudio: id => `audio/${id}`,
		deleteAudio: id => `audio/${id}`,
		connectAudio: id => `audio/connect/${id}`,
		createAudioLike: () => 'audio/like',
		createAudioTrack: () => 'audio/track',
		getAudioLike: id => `audio/like/${id}`,
		getAudioIndexing: id => `audio/indexing/${id}`,
		getAudioPosition: id => `audio/track/${id}`,

		// VoiceNote

		voiceNote: (receiver_id, voice_note_id) =>
			`voicenote/${receiver_id}/${voice_note_id}`,
		voiceNotes: () => 'voicenotes',
		createVoiceNote: () => 'voicenote',

		/// Club
		getList: id => `list/${id}`,
		getClub: id => `club/${id}`,
		getClubs: () => 'clubs',
		getClubsByUserId: id => `club/connect/clubs/user/${id}`,
		getUsersByClubId: id => `club/connect/users/${id}`,
		getRoomImagesByClubId: id => `club-room/images/${id}`,
		createClub: () => 'club',
		requestClubAccess: () => 'clubreq/request',
		updateClub: id => `club/${id}`,
		deleteClub: id => `club/${id}`,
		connectClub: id => 'club/connect/user',
		delConnectClub: id => `club/connect/user/${id}`,
		createRecorderClub: id => 'club/recorder',
		getRecroderClub: id => `club/recorder/${id}`,
		getClubManagers: id => `club/managers/${id}`,

		/// Viewer
		getViewer: id => `viewer/${id}`,
		getViewers: () => 'viewers',
		getViewerByAssembleId: id => `viewers/channel/${id}`,
		createViewer: () => 'viewer',
		updateViewer: id => `viewer/${id}`,
		deleteViewer: id => `viewer/${id}`,

		tutorAudio: () => 'tutoraudio',

		getEvent: id => `event/${id}`,
		getEvents: () => 'events',
		notifyEvent: id => `notify/event/${id}`,
		deleteEvent: id => `event/${id}`,
		endEvent: id => `endevent/${id}`,
	},
};
