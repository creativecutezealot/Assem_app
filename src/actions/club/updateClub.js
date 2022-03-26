// ------------------------------------
// Constants
// ------------------------------------
export const PATCH_CLUB_REQUEST = 'PATCH_CLUB_REQUEST';
export const PATCH_CLUB_SUCCESS = 'PATCH_CLUB_SUCCESS';
export const PATCH_CLUB_FAILED = 'PATCH_CLUB_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: PATCH_CLUB_REQUEST,
        payload,
    };
}

export function requestSuccess(data, payload) {
    return {
        type: PATCH_CLUB_SUCCESS,
        data,
        payload,
    };
}

export function requestFailure(error, payload) {
    return {
        type: PATCH_CLUB_FAILED,
        error,
        payload,
    };
}
