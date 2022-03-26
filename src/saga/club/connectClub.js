import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/club/connectClub';
import * as getActionType from '../../actions/club/getClubByUserId';

import { normailzeQSData } from '../normalize';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    try {
        const { payload } = action;
        const URL = HOSTNAME + ENDPOINTS.connectClub();
        console.log('@@@@@ connectclub action: ' + actionType.POST_CONNECT_CLUB_REQUEST);
        const sendData = {
            method: 'POST',
            url: URL,
            data: normailzeQSData(payload),
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.POST_CONNECT_CLUB_SUCCESS,
            data: parsedAnswer,
        });
        if (!payload.isJoined) {
            yield put({
                type: getActionType.GET_CLUB_BY_USER_REQUEST,
                payload: {
                    id: global.currentUser.user_id,
                },
            });
        }
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.POST_CONNECT_CLUB_FAILED, error });
    }
}

export function* connectClub() {
    yield takeEvery(actionType.POST_CONNECT_CLUB_REQUEST, fetchData);
}
