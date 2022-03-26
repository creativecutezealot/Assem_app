import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/club/getClubs';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    try {
        const URL = HOSTNAME + ENDPOINTS.getClubs();
        console.log('@@@@@ getclubs action: ' + actionType.GET_CLUBS_REQUEST);
        const sendData = {
            method: 'GET',
            url: URL,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.GET_CLUBS_SUCCESS,
            data: parsedAnswer,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.GET_CLUBS_FAILED, error });
    }
}

export function* getClubs() {
    yield takeEvery(actionType.GET_CLUBS_REQUEST, fetchData);
}
