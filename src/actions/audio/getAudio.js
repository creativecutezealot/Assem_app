// ------------------------------------
// Constants
// ------------------------------------
export const GET_AUDIO_REQUEST = 'GET_AUDIO_REQUEST';
export const GET_AUDIO_SUCCESS = 'GET_AUDIO_SUCCESS';
export const GET_AUDIO_FAILED = 'GET_AUDIO_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: GET_AUDIO_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: GET_AUDIO_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: GET_AUDIO_FAILED,
        error,
        payload,
    };
}
