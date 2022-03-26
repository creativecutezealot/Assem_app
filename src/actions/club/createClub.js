// ------------------------------------
// Constants
// ------------------------------------
export const POST_CLUB_REQUEST = 'POST_CLUB_REQUEST';
export const POST_CLUB_SUCCESS = 'POST_CLUB_SUCCESS';
export const POST_CLUB_FAILED = 'POST_CLUB_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: POST_CLUB_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: POST_CLUB_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: POST_CLUB_FAILED,
        error,
    };
}
