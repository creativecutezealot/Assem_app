import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/viewer/getViewerByAssemble';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.getViewerByAssembleId(payload.id);
        console.log('@@@@@ getviewerbyassemble action: ' + actionType.GET_VIEWER_BY_ASSEMBLE_REQUEST);
        console.log(URL);
        const sendData = {
            method: 'GET',
            url: URL,
        };
        console.log('@@@@@ getviewerbyassebme send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ getviewerbyassebme answer ==> ');            
        yield put({
            type: actionType.GET_VIEWER_BY_ASSEMBLE_SUCCESS,
            data: parsedAnswer,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ getviewerbyassebme error ==>', error);
        yield put({
            type: actionType.GET_VIEWER_BY_ASSEMBLE_FAILED,
            error,
            payload,
        });
    }
}

export function* getViewersByAssembleId() {
    yield takeEvery(actionType.GET_VIEWER_BY_ASSEMBLE_REQUEST, fetchData);
}
