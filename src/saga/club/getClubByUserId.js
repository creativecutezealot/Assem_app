import { put, takeEvery, call } from 'redux-saga/effects';
import R from 'ramda';
import axiosInstance from '../../api/axiosConf';
import * as actionType from '../../actions/club/getClubByUserId';
import * as currentClubAction from '../../actions/club/currentClub';
import APIConfig from '../../api/const';
import { sortByUpdatedAt, setObjInfo } from '../../helpers/utils';
import constVal from '../../helpers/constant';

const HOSTNAME = APIConfig.apiSite;
const ENDPOINTS = APIConfig.apiEndpoints;

function* fetchData(action) {
    const { payload } = action;
    try {
        const URL = HOSTNAME + ENDPOINTS.getClubsByUserId(payload.id);
        console.log('@@@@@ getclubbyuserid action: ' + actionType.GET_CLUB_BY_USER_REQUEST);
        const sendData = {
            method: 'GET',
            url: URL,
        };
        const data = yield call(axiosInstance, sendData);
        const parsedAnswer = data.data;
        var sortedClubs = [];
        if (parsedAnswer.connect && parsedAnswer.connect.length > 0) {
            sortedClubs = parsedAnswer.connect.sort(sortByUpdatedAt);
            const club = R.last(sortedClubs);
            console.log('@@@@@ get clubs sorted');
            yield call(setCurClub, club);
            yield put({
                type: currentClubAction.CURRENT_CLUB_UPDATE,
                data: club,
            });
        } else {
            yield call(setCurClub, null);
            yield put({
                type: currentClubAction.CURRENT_CLUB_UPDATE,
                data: null,
            });
        }
        console.log('@@@@@ answer ==> ');
        yield put({
            type: actionType.GET_CLUB_BY_USER_SUCCESS,
            data: sortedClubs,
            payload,
        });
    } catch (error) {
        console.log('@@@@@ error ==>', error);
        yield put({ type: actionType.GET_CLUB_BY_USER_FAILED, error, payload });
    }
}

export function* getClubsByUserId() {
    yield takeEvery(actionType.GET_CLUB_BY_USER_REQUEST, fetchData);
}

async function setCurClub(curClub) {
    return await setObjInfo(constVal.CUR_CLUB, curClub);
}
