import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/event/updateEvent';
import { normailzeQSData } from '../normalize';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.updateEvent(payload.id);
        console.log('@@@@@ updateevent : '+actionType.PATCH_EVENT_REQUEST);
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
            type: actionType.PATCH_EVENT_SUCCESS,
            data: parsedAnswer,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ error ==>');
        yield put({ type: actionType.PATCH_EVENT_FAILED, error, payload });
    }
}

export function* updateEvent() {
    yield takeEvery(actionType.PATCH_EVENT_REQUEST, fetchData);
}
