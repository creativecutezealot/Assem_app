// ------------------------------------
// Constants
// ------------------------------------
export const PATCH_ASSEMBLE_REQUEST = 'PATCH_ASSEMBLE_REQUEST';
export const PATCH_ASSEMBLE_SUCCESS = 'PATCH_ASSEMBLE_SUCCESS';
export const PATCH_ASSEMBLE_FAILED = 'PATCH_ASSEMBLE_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: PATCH_ASSEMBLE_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: PATCH_ASSEMBLE_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: PATCH_ASSEMBLE_FAILED,
        error,
        payload,
    };
}
