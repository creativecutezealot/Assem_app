import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/auth/updatePass';
import { normailzeQSData } from '../normalize';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    try {
        const { payload } = action;
        const URL = HOSTNAME + ENDPOINTS.updatePass();
        console.log('@@@@@ updatepass action: ' + actionType.PATCH_USER_PASS_REQUEST);
        const sendData = {
            method: 'PATCH',
            url: URL,
            data: normailzeQSData(payload),
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.PATCH_USER_PASS_SUCCESS,
            data: parsedAnswer,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.PATCH_USER_PASS_FAILED, error });
    }
}

export function* updatePass() {
    yield takeEvery(actionType.PATCH_USER_PASS_REQUEST, fetchData);
}
