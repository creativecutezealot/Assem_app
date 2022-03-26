import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/user/getUser';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.getUser(payload.id);
        console.log('@@@@@ getuser action: ' + actionType.GET_USER_REQUEST);
        const sendData = {
            method: 'GET',
            url: URL,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.GET_USER_SUCCESS,
            data: parsedAnswer,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.GET_USER_FAILED, error, payload });
    }
}

export function* getUser() {
    yield takeEvery(actionType.GET_USER_REQUEST, fetchData);
}
