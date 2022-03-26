// ------------------------------------
// Constants
// ------------------------------------
export const DELETE_AUDIO_REQUEST = 'DELETE_AUDIO_REQUEST';
export const DELETE_AUDIO_SUCCESS = 'DELETE_AUDIO_SUCCESS';
export const DELETE_AUDIO_FAILED = 'DELETE_AUDIO_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: DELETE_AUDIO_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: DELETE_AUDIO_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: DELETE_AUDIO_FAILED,
        error,
        payload,
    };
}
