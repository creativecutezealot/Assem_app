import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/event/getEvent';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.getEvent(payload.id);
        console.log('@@@@@ getevent action: ' + actionType.GET_EVENT_REQUEST);
        const sendData = {
            method: 'GET',
            url: URL,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.GET_EVENT_SUCCESS,
            data: parsedAnswer,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.GET_EVENT_FAILED, error, payload });
    }
}

export function* getEvent() {
    yield takeEvery(actionType.GET_EVENT_REQUEST, fetchData);
}
