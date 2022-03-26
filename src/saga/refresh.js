import { put, takeLatest, call } from 'redux-saga/effects';
import { FOREGROUND, BACKGROUND } from 'redux-enhancer-react-native-appstate';
import { getObjInfo, setObjInfo } from '../helpers/utils';
import constVal from '../helpers/constant';
import axiosInstance from '../api/axiosConf';
import * as actionType from '../actions/club/getListByClubId';
import * as currentClubAction from '../actions/club/currentClub';
import { normailzeQSData } from './normalize';
import APIConfig from '../api/const';
function* fetchData() {
	const userInfo = yield call(getDevUserInfo);
	if (userInfo !== null) {
		console.log('@@@@@ REFRESH DATA ====>');
		const sendData = {
			method: 'GET',
			url: APIConfig.apiEndpoints.getUser(userInfo.user_id),
		};
		const curClub = yield call(getCurClub);
		if (curClub) {
			console.log('@@@@@ REFRESH CLUB ====>');
			yield put({
				type: currentClubAction.CURRENT_CLUB_UPDATE,
				data: curClub,
			});
			yield put({
				type: actionType.GET_LIST_BY_CLUB_REQUEST,
				payload: {
					id: userInfo.user_id,
				},
			});
		}
		const data = yield call(axiosInstance, sendData);
		const parsedAnswer = data.data;
		if (parsedAnswer.status) {
			console.log('@@@@@ REFRESH APP ====>');
			global.currentUser = parsedAnswer.data;
			yield call(setDevUserInfo, parsedAnswer.data);
		}

		const updatePresenceData = {
			method: 'patch',
			url: APIConfig.apiEndpoints.updateUser(),
			data: normailzeQSData({
				userid: userInfo.user_id,
				presence: 'active',
			}),
		};
		yield call(axiosInstance, updatePresenceData);
	}
}

function* refreshBackground() {
	console.warn('refreshBackground: ');
	const userInfo = yield call(getDevUserInfo);
	if (userInfo !== null) {
		const updatePresenceData = {
			method: 'patch',
			url: APIConfig.apiEndpoints.updateUser(),
			data: normailzeQSData({
				userid: userInfo.user_id,
				presence: 'offline',
			}),
		};
		yield call(axiosInstance, updatePresenceData);
	}
}
function* refreshForeground() {
	yield takeLatest(FOREGROUND, fetchData);
	yield takeLatest(BACKGROUND, refreshBackground);
}
async function getDevUserInfo() {
	return await getObjInfo(constVal.USER_KEY);
}
async function getCurClub() {
	return await getObjInfo(constVal.CUR_CLUB);
}
async function setDevUserInfo(userInfo) {
	return await setObjInfo(constVal.USER_KEY, userInfo);
}
export default refreshForeground;
