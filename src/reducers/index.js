import { combineReducers } from 'redux';
import routes from './routes';
import * as logoutAction from '../actions/auth/logout';
import {
	assembleDEL,
	assembleGET,
	assemblePATCH,
	assemblePOST,
	assemblesGET,
	inviteAssemble,
} from './assemble';
import {
	audioDEL,
	audioGET,
	audioPATCH,
	audioPOST,
	audiosGET,
	inviteAudio,
} from './audio';
import { inviteVoicenote } from './voicenote';
import {
	eventDEL,
	eventGET,
	eventsGET,
	inviteEvent,
} from './event';
import { aCodePOST, aCodeGET } from './aCode';
import { vCodeGET, vCodePOST } from './vCode';
import { viewerData, viewersData } from './viewer';
import {
	clubDEL,
	clubGET,
	clubPATCH,
	clubPOST,
	clubsByUserGET,
	clubsGET,
	connectClubPOST,
	connectClubDEL,
	currentClub,
	listGET,
} from './club';
import { userPATCH, userPOST, userpassPATCH } from './auth';
import {
	userGET,
	usersGET,
	connectUserPOST,
	connectUserDEL,
	likeUser,
	presenceUser,
	usersFollowGET,
	usersFollowingGET,
} from './user';
import socket from './socket';

const appReducer = combineReducers({
	routes,
	assembleDEL,
	assembleGET,
	assemblePATCH,
	assemblePOST,
	assemblesGET,
	inviteAssemble,
	aCodePOST,
	aCodeGET,
	vCodeGET,
	vCodePOST,
	viewerData,
	viewersData,
	clubDEL,
	clubGET,
	clubPATCH,
	clubPOST,
	clubsByUserGET,
	clubsGET,
	connectClubPOST,
	connectClubDEL,
	currentClub,
	listGET,
	userPATCH,
	userPOST,
	userpassPATCH,
	userGET,
	usersGET,
	connectUserPOST,
	connectUserDEL,
	likeUser,
	presenceUser,
	usersFollowGET,
	usersFollowingGET,
	socket,
	audioDEL,
	audioGET,
	audioPATCH,
	audioPOST,
	audiosGET,
	inviteAudio,
	inviteVoicenote,
	eventDEL,
	eventGET,
	eventsGET,
	inviteEvent
});

const rootReducer = (state, action) => {
	if (action.type === logoutAction.LOGOUT_REQUEST) {
		console.log('@@@@@ logout action');
		state = undefined;
	}
	return appReducer(state, action);
};
export default rootReducer;
