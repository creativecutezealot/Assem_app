import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/audio/getAudios';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    try {
        const URL = HOSTNAME + ENDPOINTS.getAudios();
        console.log('@@@@@ getaudios action: ' + actionType.GET_AUDIOS_REQUEST);
        const sendData = {
            method: 'GET',
            url: URL,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.GET_AUDIOS_SUCCESS,
            data: parsedAnswer,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.GET_AUDIOS_FAILED, error });
    }
}

export function* getAudios() {
    yield takeEvery(actionType.GET_AUDIOS_REQUEST, fetchData);
}
