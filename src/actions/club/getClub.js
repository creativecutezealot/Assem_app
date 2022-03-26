// ------------------------------------
// Constants
// ------------------------------------
export const GET_CLUB_REQUEST = 'GET_CLUB_REQUEST';
export const GET_CLUB_SUCCESS = 'GET_CLUB_SUCCESS';
export const GET_CLUB_FAILED = 'GET_CLUB_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_CLUB_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: GET_CLUB_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: GET_CLUB_FAILED,
        error,
        payload,
    };
}
