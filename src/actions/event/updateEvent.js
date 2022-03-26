// ------------------------------------
// Constants
// ------------------------------------
export const PATCH_EVENT_REQUEST = 'PATCH_EVENT_REQUEST';
export const PATCH_EVENT_SUCCESS = 'PATCH_EVENT_SUCCESS';
export const PATCH_EVENT_FAILED = 'PATCH_EVENT_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: PATCH_EVENT_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: PATCH_EVENT_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: PATCH_EVENT_FAILED,
        error,
        payload,
    };
}
