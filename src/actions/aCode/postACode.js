// ------------------------------------
// Constants
// ------------------------------------
export const POST_ACODE_REQUEST = 'POST_ACODE_REQUEST';
export const POST_ACODE_SUCCESS = 'POST_ACODE_SUCCESS';
export const POST_ACODE_FAILED = 'POST_ACODE_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: POST_ACODE_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: POST_ACODE_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: POST_ACODE_FAILED,
        error,
    };
}
