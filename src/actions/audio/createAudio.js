// ------------------------------------
// Constants
// ------------------------------------
export const POST_AUDIO_REQUEST = 'POST_AUDIO_REQUEST';
export const POST_AUDIO_SUCCESS = 'POST_AUDIO_SUCCESS';
export const POST_AUDIO_FAILED = 'POST_AUDIO_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: POST_AUDIO_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: POST_AUDIO_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: POST_AUDIO_FAILED,
        error,
    };
}
