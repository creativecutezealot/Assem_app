// ------------------------------------
// Constants
// ------------------------------------
export const GET_CLUBS_REQUEST = 'GET_CLUBS_REQUEST';
export const GET_CLUBS_SUCCESS = 'GET_CLUBS_SUCCESS';
export const GET_CLUBS_FAILED = 'GET_CLUBS_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_CLUBS_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: GET_CLUBS_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: GET_CLUBS_FAILED,
        error,
    };
}
