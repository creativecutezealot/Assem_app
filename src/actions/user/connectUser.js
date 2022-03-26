// ------------------------------------
// Constants
// ------------------------------------
export const POST_CONNECT_USER_REQUEST = 'POST_CONNECT_USER_REQUEST';
export const POST_CONNECT_USER_SUCCESS = 'POST_CONNECT_USER_SUCCESS';
export const POST_CONNECT_USER_FAILED = 'REGISTER_PHONE_EMAIL_POST_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: POST_CONNECT_USER_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: POST_CONNECT_USER_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: POST_CONNECT_USER_FAILED,
        error,
    };
}
