// ------------------------------------
// Constants
// ------------------------------------
export const GET_ACODE_REQUEST = 'GET_ACODE_REQUEST';
export const GET_ACODE_SUCCESS = 'GET_ACODE_SUCCESS';
export const GET_ACODE_FAILED = 'GET_ACODE_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_ACODE_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: GET_ACODE_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: GET_ACODE_FAILED,
        error,
        payload,
    };
}
