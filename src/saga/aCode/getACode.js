import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/aCode/getACode';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.getACode(payload.code);
        console.log('@@@@@ getacode action: ' + actionType.GET_ACODE_REQUEST);
        const sendData = {
            method: 'GET',
            url: URL,
        };
        console.log('@@@@@ getacode send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ getacode answer ==> ');
        yield put({
            type: actionType.GET_ACODE_SUCCESS,
            data: parsedAnswer,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.GET_ACODE_FAILED, error, payload });
    }
}

export function* getACode() {
    yield takeEvery(actionType.GET_ACODE_REQUEST, fetchData);
}
