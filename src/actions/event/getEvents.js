// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENTS_REQUEST = 'GET_EVENTS_REQUEST';
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const GET_EVENTS_FAILED = 'GET_EVENTS_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_EVENTS_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: GET_EVENTS_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: GET_EVENTS_FAILED,
        error,
    };
}
