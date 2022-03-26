// ------------------------------------
// Constants
// ------------------------------------
export const DELETE_ASSEMBLE_REQUEST = 'DELETE_ASSEMBLE_REQUEST';
export const DELETE_ASSEMBLE_SUCCESS = 'DELETE_ASSEMBLE_SUCCESS';
export const DELETE_ASSEMBLE_FAILED = 'DELETE_ASSEMBLE_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: DELETE_ASSEMBLE_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: DELETE_ASSEMBLE_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: DELETE_ASSEMBLE_FAILED,
        error,
        payload,
    };
}
