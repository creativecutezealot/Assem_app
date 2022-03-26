// ------------------------------------
// Constants
// ------------------------------------
export const GET_ASSEMBLES_REQUEST = 'GET_ASSEMBLES_REQUEST';
export const GET_ASSEMBLES_SUCCESS = 'GET_ASSEMBLES_SUCCESS';
export const GET_ASSEMBLES_FAILED = 'GET_ASSEMBLES_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_ASSEMBLES_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: GET_ASSEMBLES_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: GET_ASSEMBLES_FAILED,
        error,
    };
}
