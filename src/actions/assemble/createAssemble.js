// ------------------------------------
// Constants
// ------------------------------------
export const POST_ASSEMBLE_REQUEST = 'POST_ASSEMBLE_REQUEST';
export const POST_ASSEMBLE_SUCCESS = 'POST_ASSEMBLE_SUCCESS';
export const POST_ASSEMBLE_FAILED = 'POST_ASSEMBLE_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: POST_ASSEMBLE_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: POST_ASSEMBLE_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: POST_ASSEMBLE_FAILED,
        error,
    };
}
