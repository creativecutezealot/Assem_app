// ------------------------------------
// Constants
// ------------------------------------
export const PATCH_USER_REQUEST = 'PATCH_USER_REQUEST';
export const PATCH_USER_SUCCESS = 'PATCH_USER_SUCCESS';
export const PATCH_USER_FAILED = 'PATCH_USER_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: PATCH_USER_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: PATCH_USER_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: PATCH_USER_FAILED,
        error,
    };
}
