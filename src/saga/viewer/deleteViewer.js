import { put, takeEvery, call } from 'redux-saga/effects';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/viewer/deleteViewer';
import * as getActionType from '../../actions/viewer/getViewerByAssemble';
import APIConfig from '../../api/const';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.deleteViewer(payload.id);
        console.log('@@@@@ deleteviewer action: ' + actionType.DELETE_VIEWER_REQUEST);
        const sendData = {
            method: 'DELETE',
            url: URL,
            data: payload,
        };
        console.log('@@@@@ send ==>');
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.DELETE_VIEWER_SUCCESS,
            data: parsedAnswer,
            payload,
        });
        yield put({
            type: getActionType.GET_VIEWER_BY_ASSEMBLE_REQUEST,
            payload: { id: payload.channel_id },
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.DELETE_VIEWER_FAILED, error, payload });
    }
}

export function* deleteViewer() {
    yield takeEvery(actionType.DELETE_VIEWER_REQUEST, fetchData);
}
