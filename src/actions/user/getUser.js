// ------------------------------------
// Constants
// ------------------------------------
export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILED = 'REGISTER_PHONE_EMAIL_POST_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_USER_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: GET_USER_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: GET_USER_FAILED,
        error,
    };
}
