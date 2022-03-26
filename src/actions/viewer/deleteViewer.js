// ------------------------------------
// Constants
// ------------------------------------
export const DELETE_VIEWER_REQUEST = 'DELETE_VIEWER_REQUEST';
export const DELETE_VIEWER_SUCCESS = 'DELETE_VIEWER_SUCCESS';
export const DELETE_VIEWER_FAILED = 'DELETE_VIEWER_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: DELETE_VIEWER_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: DELETE_VIEWER_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: DELETE_VIEWER_FAILED,
        error,
        payload,
    };
}
