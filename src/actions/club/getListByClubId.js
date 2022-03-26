// ------------------------------------
// Constants
// ------------------------------------
export const GET_LIST_BY_CLUB_REQUEST = 'GET_LIST_BY_CLUB_REQUEST';
export const GET_LIST_BY_CLUB_SUCCESS = 'GET_LIST_BY_CLUB_SUCCESS';
export const GET_LIST_BY_CLUB_FAILED = 'GET_LIST_BY_CLUB_FAILED';
export const ADD_LIST_BY_CLUB = 'ADD_LIST_BY_CLUB';
export const UPDATE_LIST_BY_CLUB = 'UPDATE_LIST_BY_CLUB';
export const DEL_LIST_BY_CLUB = 'DEL_LIST_BY_CLUB';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_LIST_BY_CLUB_REQUEST,
        payload,
    };
}

export function addList(data, payload) {
    return {
        type: ADD_LIST_BY_CLUB,
        data,
        payload,
    };
}

export function updateList(data, payload) {
    return {
        type: UPDATE_LIST_BY_CLUB,
        data,
        payload,
    };
}

export function deleteList(data, payload) {
    return {
        type: DEL_LIST_BY_CLUB,
        data,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: GET_LIST_BY_CLUB_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: GET_LIST_BY_CLUB_FAILED,
        error,
        payload,
    };
}
