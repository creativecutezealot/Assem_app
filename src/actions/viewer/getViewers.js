// ------------------------------------
// Constants
// ------------------------------------
export const GET_VIEWERS_REQUEST = 'GET_VIEWERS_REQUEST';
export const GET_VIEWERS_SUCCESS = 'GET_VIEWERS_SUCCESS';
export const GET_VIEWERS_FAILED = 'GET_VIEWERS_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_VIEWERS_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: GET_VIEWERS_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: GET_VIEWERS_FAILED,
        error,
    };
}
