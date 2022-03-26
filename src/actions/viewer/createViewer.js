// ------------------------------------
// Constants
// ------------------------------------
export const POST_VIEWER_REQUEST = 'POST_VIEWER_REQUEST';
export const POST_VIEWER_SUCCESS = 'POST_VIEWER_SUCCESS';
export const POST_VIEWER_FAILED = 'POST_VIEWER_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: POST_VIEWER_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: POST_VIEWER_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: POST_VIEWER_FAILED,
        error,
        payload,
    };
}
