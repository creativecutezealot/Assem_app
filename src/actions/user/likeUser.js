export const LIKE_USER_UPDATE = 'LIKE_USER_UPDATE';

// ------------------------------------
// Actions
// ------------------------------------
export function update(data) {
    return {
        type: LIKE_USER_UPDATE,
        data,
    };
}
