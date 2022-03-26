// ------------------------------------
// Constants
// ------------------------------------
export const POST_CONNECT_CLUB_REQUEST = 'POST_CONNECT_CLUB_REQUEST';
export const POST_CONNECT_CLUB_SUCCESS = 'POST_CONNECT_CLUB_SUCCESS';
export const POST_CONNECT_CLUB_FAILED = 'POST_CONNECT_CLUB_FAILED';

// ------------------------------------
// Actions
// ------------------------------------
export function request(payload) {
    return {
        type: POST_CONNECT_CLUB_REQUEST,
        payload,
    };
}

export function requestSuccess(data) {
    return {
        type: POST_CONNECT_CLUB_SUCCESS,
        data,
    };
}

export function requestFailure(error) {
    return {
        type: POST_CONNECT_CLUB_FAILED,
        error,
    };
}
