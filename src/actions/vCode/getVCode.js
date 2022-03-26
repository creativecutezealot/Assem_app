// ------------------------------------
// Constants
// ------------------------------------
export const GET_VCODE_REQUEST = 'GET_VCODE_REQUEST';
export const GET_VCODE_SUCCESS = 'GET_VCODE_SUCCESS';
export const GET_VCODE_FAILED = 'GET_VCODE_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_VCODE_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: GET_VCODE_SUCCESS,
        data,
    };
}

export function requestFailure(error, payload) {
    return {
        type: GET_VCODE_FAILED,
        error,
    };
}
