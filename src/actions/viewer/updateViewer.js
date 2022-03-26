// ------------------------------------
// Constants
// ------------------------------------
export const PATCH_VIEWER_REQUEST = 'PATCH_VIEWER_REQUEST';
export const PATCH_VIEWER_SUCCESS = 'PATCH_VIEWER_SUCCESS';
export const PATCH_VIEWER_FAILED = 'PATCH_VIEWER_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: PATCH_VIEWER_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: PATCH_VIEWER_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: PATCH_VIEWER_FAILED,
        error,
        payload,
    };
}
