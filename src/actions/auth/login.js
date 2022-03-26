// ------------------------------------
// Constants
// ------------------------------------
export const POST_USER_REQUEST = 'POST_USER_REQUEST';
export const POST_USER_SUCCESS = 'POST_USER_SUCCESS';
export const POST_USER_FAILED = 'POST_USER_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: POST_USER_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: POST_USER_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: POST_USER_FAILED,
        error,
    };
}
