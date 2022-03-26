// ------------------------------------
// Constants
// ------------------------------------
export const POST_VCODE_REQUEST = 'POST_VCODE_REQUEST';
export const POST_VCODE_SUCCESS = 'POST_VCODE_SUCCESS';
export const POST_VCODE_FAILED = 'POST_VCODE_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: POST_VCODE_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: POST_VCODE_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: POST_VCODE_FAILED,
        error,
    };
}
