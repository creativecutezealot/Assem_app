import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/auth/login';
import { normailzeQSData } from '../normalize';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    try {
        const { payload } = action;
        const URL = HOSTNAME + ENDPOINTS.login();
        console.log('@@@@@ login action: ' + actionType.POST_USER_REQUEST);
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
            type: actionType.POST_USER_SUCCESS,
            data: parsedAnswer,
        });
    } catch (error) {
        console.log('@@@@@ error ==>');
        yield put({ type: actionType.POST_USER_FAILED, error });
    }
}

export function* login() {
    yield takeEvery(actionType.POST_USER_REQUEST, fetchData);
}
