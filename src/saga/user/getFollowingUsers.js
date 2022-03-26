import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/user/getFollowingUsers';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.connectUsers();
        console.log('@@@@@ getfollowing user action: ' + actionType.GET_FOLLOWING_USERS_REQUEST);
        const sendData = {
            method: 'GET',
            url: URL,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.GET_FOLLOWING_USERS_SUCCESS,
            data: parsedAnswer,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({
            type: actionType.GET_FOLLOWING_USERS_FAILED,
            error,
            payload,
        });
    }
}

export function* getFollowingUsers() {
    yield takeEvery(actionType.GET_FOLLOWING_USERS_REQUEST, fetchData);
}
