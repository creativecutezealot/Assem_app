// ------------------------------------
// Constants
// ------------------------------------
export const DELETE_CLUB_REQUEST = 'DELETE_CLUB_REQUEST';
export const DELETE_CLUB_SUCCESS = 'DELETE_CLUB_SUCCESS';
export const DELETE_CLUB_FAILED = 'DELETE_CLUB_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: DELETE_CLUB_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: DELETE_CLUB_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: DELETE_CLUB_FAILED,
        error,
        payload,
    };
}
