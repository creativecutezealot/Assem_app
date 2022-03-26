import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/club/getListByClubId';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.getList(payload.id);
        console.log('@@@@@ getlistbyclubid action: '+actionType.GET_LIST_BY_CLUB_REQUEST);
        console.log(URL);
        const sendData = {
            method: 'GET',
            url: URL,
        };
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        const listData = parsedAnswer.data || [];
        yield put({
            type: actionType.GET_LIST_BY_CLUB_SUCCESS,
            data: listData,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ getlistbyclubid error ==>', error);
        yield put({ type: actionType.GET_LIST_BY_CLUB_FAILED, error, payload });
    }
}

export function* getListByClubId() {
    yield takeEvery(actionType.GET_LIST_BY_CLUB_REQUEST, fetchData);
}
