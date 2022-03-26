// ------------------------------------
// Constants
// ------------------------------------
export const DEL_CONNECT_CLUB_REQUEST = 'DEL_CONNECT_CLUB_REQUEST';
export const DEL_CONNECT_CLUB_SUCCESS = 'DEL_CONNECT_CLUB_SUCCESS';
export const DEL_CONNECT_CLUB_FAILED = 'DEL_CONNECT_CLUB_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: DEL_CONNECT_CLUB_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: DEL_CONNECT_CLUB_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: DEL_CONNECT_CLUB_FAILED,
        error,
    };
}
