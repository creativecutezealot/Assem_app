import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/user/delConnectUser';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    try {
        const { payload } = action;
        const URL =
            HOSTNAME +
            ENDPOINTS.delConnectUser(payload.opposite_id, payload.club_id);
        console.log('@@@@@ deleteconnectuser action: ' + actionType.DEL_CONNECT_USER_REQUEST);
        const sendData = {
            method: 'DELETE',
            url: URL,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.DEL_CONNECT_USER_SUCCESS,
            data: parsedAnswer,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.DEL_CONNECT_USER_FAILED, error });
    }
}

export function* delConnectUser() {
    yield takeEvery(actionType.DEL_CONNECT_USER_REQUEST, fetchData);
}
