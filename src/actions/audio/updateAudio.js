// ------------------------------------
// Constants
// ------------------------------------
export const PATCH_AUDIO_REQUEST = 'PATCH_AUDIO_REQUEST';
export const PATCH_AUDIO_SUCCESS = 'PATCH_AUDIO_SUCCESS';
export const PATCH_AUDIO_FAILED = 'PATCH_AUDIO_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: PATCH_AUDIO_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: PATCH_AUDIO_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: PATCH_AUDIO_FAILED,
        error,
        payload,
    };
}
