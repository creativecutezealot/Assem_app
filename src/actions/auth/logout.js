// ------------------------------------
// Constants
// ------------------------------------
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export function logout() {
    return {
        type: LOGOUT_REQUEST,
    };
}
