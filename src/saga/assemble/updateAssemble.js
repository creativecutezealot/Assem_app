import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/assemble/updateAssemble';
import { normailzeQSData } from '../normalize';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.updateAssemble(payload.id);
        console.log('@@@@@ updateassemble : '+actionType.PATCH_ASSEMBLE_REQUEST);
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
            type: actionType.PATCH_ASSEMBLE_SUCCESS,
            data: parsedAnswer,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ error ==>');
        yield put({ type: actionType.PATCH_ASSEMBLE_FAILED, error, payload });
    }
}

export function* updateAssemble() {
    yield takeEvery(actionType.PATCH_ASSEMBLE_REQUEST, fetchData);
}
