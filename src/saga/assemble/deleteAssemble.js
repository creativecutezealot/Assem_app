import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/assemble/deleteAssemble';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.deleteAssemble(payload.id);
        console.log('@@@@@ deleteassemble action: ' + actionType.DELETE_ASSEMBLE_REQUEST);
        const sendData = {
            method: 'DELETE',
            url: URL,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.DELETE_ASSEMBLE_SUCCESS,
            data: parsedAnswer,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.DELETE_ASSEMBLE_FAILED, error, payload });
    }
}

export function* deleteAssemble() {
    yield takeEvery(actionType.DELETE_ASSEMBLE_REQUEST, fetchData);
}
