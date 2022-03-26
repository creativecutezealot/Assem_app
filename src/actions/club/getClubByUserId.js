// ------------------------------------
// Constants
// ------------------------------------
export const GET_CLUB_BY_USER_REQUEST = 'GET_CLUB_BY_USER_REQUEST';
export const GET_CLUB_BY_USER_SUCCESS = 'GET_CLUB_BY_USER_SUCCESS';
export const GET_CLUB_BY_USER_FAILED = 'GET_CLUB_BY_USER_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_CLUB_BY_USER_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: GET_CLUB_BY_USER_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: GET_CLUB_BY_USER_FAILED,
        error,
        payload,
    };
}
