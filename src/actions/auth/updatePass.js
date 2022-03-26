// ------------------------------------
// Constants
// ------------------------------------
export const PATCH_USER_PASS_REQUEST = 'PATCH_USER_PASS_REQUEST';
export const PATCH_USER_PASS_SUCCESS = 'PATCH_USER_PASS_SUCCESS';
export const PATCH_USER_PASS_FAILED = 'PATCH_USER_PASS_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: PATCH_USER_PASS_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: PATCH_USER_PASS_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: PATCH_USER_PASS_FAILED,
        error,
    };
}
