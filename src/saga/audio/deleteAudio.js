import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/audio/deleteAudio';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.deleteAudio(payload.id);
        console.log('@@@@@ deleteaudio action: '+actionType.DELETE_AUDIO_REQUEST);
        const sendData = {
            method: 'DELETE',
            url: URL,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.DELETE_AUDIO_SUCCESS,
            data: parsedAnswer,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ error ==>');
        yield put({ type: actionType.DELETE_AUDIO_FAILED, error, payload });
    }
}

export function* deleteAudio() {
    yield takeEvery(actionType.DELETE_AUDIO_REQUEST, fetchData);
}
