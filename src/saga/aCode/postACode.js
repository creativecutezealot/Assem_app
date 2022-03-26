import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/aCode/postACode';
import { normailzeQSData } from '../normalize';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    try {
        const { payload } = action;
        const URL = HOSTNAME + ENDPOINTS.postACode();
        console.log('@@@@@ postacode: ' + actionType.POST_ACODE_REQUEST);
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
            type: actionType.POST_ACODE_SUCCESS,
            data: parsedAnswer,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.POST_ACODE_FAILED, error });
    }
}

export function* postACode() {
    yield takeEvery(actionType.POST_ACODE_REQUEST, fetchData);
}
