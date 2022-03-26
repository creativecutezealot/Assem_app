import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/event/deleteEvent';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.deleteEvent(payload.id);
        console.log('@@@@@ deleteevent action: ' + actionType.DELETE_EVENT_REQUEST);
        const sendData = {
            method: 'DELETE',
            url: URL,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.DELETE_EVENT_SUCCESS,
            data: parsedAnswer,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.DELETE_EVENT_FAILED, error, payload });
    }
}

export function* deleteEvent() {
    yield takeEvery(actionType.DELETE_EVENT_REQUEST, fetchData);
}
