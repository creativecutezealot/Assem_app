// ------------------------------------
// Constants
// ------------------------------------
export const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAILED = 'REGISTER_PHONE_EMAIL_POST_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_USERS_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: GET_USERS_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: GET_USERS_FAILED,
        error,
    };
}
