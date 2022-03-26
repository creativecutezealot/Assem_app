// ------------------------------------
// Constants
// ------------------------------------
export const GET_AUDIOS_REQUEST = 'GET_AUDIOS_REQUEST';
export const GET_AUDIOS_SUCCESS = 'GET_AUDIOS_SUCCESS';
export const GET_AUDIOS_FAILED = 'GET_AUDIOS_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_AUDIOS_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: GET_AUDIOS_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: GET_AUDIOS_FAILED,
        error,
    };
}
