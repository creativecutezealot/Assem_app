import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/auth/update';
import { normailzeQSData } from '../normalize';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    try {
        const { payload } = action;
        const URL = HOSTNAME + ENDPOINTS.updateUser();
        console.log('@@@@@ update user action: ' + actionType.PATCH_USER_REQUEST);
        const sendData = {
            method: 'PATCH',
            url: URL,
            data: normailzeQSData(payload),
        };
        console.log('@@@@@ update user send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ update user answer ==> ', parsedAnswer);
        yield put({
            type: actionType.PATCH_USER_SUCCESS,
            data: parsedAnswer,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.PATCH_USER_FAILED, error });
    }
}

export function* updateUser() {
    yield takeEvery(actionType.PATCH_USER_REQUEST, fetchData);
}
