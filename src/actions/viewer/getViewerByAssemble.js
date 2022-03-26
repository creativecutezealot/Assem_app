// ------------------------------------
// Constants
// ------------------------------------
export const GET_VIEWER_BY_ASSEMBLE_REQUEST = 'GET_VIEWER_BY_ASSEMBLE_REQUEST';
export const GET_VIEWER_BY_ASSEMBLE_SUCCESS = 'GET_VIEWER_BY_ASSEMBLE_SUCCESS';
export const GET_VIEWER_BY_ASSEMBLE_FAILED = 'GET_VIEWER_BY_ASSEMBLE_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_VIEWER_BY_ASSEMBLE_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: GET_VIEWER_BY_ASSEMBLE_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: GET_VIEWER_BY_ASSEMBLE_FAILED,
        error,
        payload,
    };
}
