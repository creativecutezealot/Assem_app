// ------------------------------------
// Constants
// ------------------------------------
export const DEL_CONNECT_USER_REQUEST = 'DEL_CONNECT_USER_REQUEST';
export const DEL_CONNECT_USER_SUCCESS = 'DEL_CONNECT_USER_SUCCESS';
export const DEL_CONNECT_USER_FAILED = 'REGISTER_PHONE_EMAIL_DEL_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: DEL_CONNECT_USER_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: DEL_CONNECT_USER_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: DEL_CONNECT_USER_FAILED,
        error,
    };
}
