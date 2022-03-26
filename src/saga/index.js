import { all } from 'redux-saga/effects';

import { getACode, postACode } from './aCode';
import { getVCode, postVCode } from './vCode';
import {
	getAssemble,
	getAssembles,
	deleteAssemble,
	updateAssemble,
	createAssemble,
} from './assemble';
import {
	getAudio,
	getAudios,
	deleteAudio,
	updateAudio,
	createAudio,
} from './audio';
import {
	getEvent,
	getEvents,
	deleteEvent,
	updateEvent,
} from './event';
import {
	getClub,
	getClubs,
	getClubsByUserId,
	deleteClub,
	updateClub,
	createClub,
	connectClub,
	delConnectClub,
	getListByClubId,
} from './club';
import {
	getViewer,
	getViewers,
	getViewersByAssembleId,
	deleteViewer,
	updateViewer,
	createViewer,
} from './viewer';
import {
	getUser,
	getUsers,
	connectUser,
	delConnectUser,
	getFollowUsers,
	getFollowingUsers,
} from './user';
import { login, updatePass, updateUser } from './auth';
import refreshForeground from './refresh';
export default function* IndexSagas() {
	yield all([
		getACode(),
		postACode(),
		getVCode(),
		postVCode(),
		getAssemble(),
		getAssembles(),
		deleteAssemble(),
		updateAssemble(),
		createAssemble(),
		getAudio(),
		getAudios(),
		deleteAudio,
		updateAudio(),
		createAudio(),
		getEvent(),
		getEvents(),
		deleteEvent(),
		updateEvent(),
		getClub(),
		getClubs(),
		getClubsByUserId(),
		deleteClub(),
		updateClub(),
		createClub(),
		connectClub(),
		delConnectClub(),
		getListByClubId(),
		getViewer(),
		getViewers(),
		getViewersByAssembleId(),
		deleteViewer(),
		updateViewer(),
		createViewer(),
		getUser(),
		getUsers(),
		connectUser(),
		login(),
		updatePass(),
		updateUser(),
		delConnectUser(),
		getFollowUsers(),
		getFollowingUsers(),
		refreshForeground(),
	]);
}
