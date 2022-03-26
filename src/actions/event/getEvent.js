// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENT_REQUEST = 'GET_EVENT_REQUEST';
export const GET_EVENT_SUCCESS = 'GET_EVENT_SUCCESS';
export const GET_EVENT_FAILED = 'GET_EVENT_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_EVENT_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: GET_EVENT_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: GET_EVENT_FAILED,
        error,
        payload,
    };
}
