// ------------------------------------
// Constants
// ------------------------------------
export const GET_VIEWER_REQUEST = 'GET_VIEWER_REQUEST';
export const GET_VIEWER_SUCCESS = 'GET_VIEWER_SUCCESS';
export const GET_VIEWER_FAILED = 'GET_VIEWER_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_VIEWER_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: GET_VIEWER_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: GET_VIEWER_FAILED,
        error,
        payload,
    };
}
