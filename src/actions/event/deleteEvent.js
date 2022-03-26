// ------------------------------------
// Constants
// ------------------------------------
export const DELETE_EVENT_REQUEST = 'DELETE_EVENT_REQUEST';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILED = 'DELETE_EVENT_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: DELETE_EVENT_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: DELETE_EVENT_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: DELETE_EVENT_FAILED,
        error,
        payload,
    };
}
