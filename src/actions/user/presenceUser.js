export const PRESENCE_USER_UPDATE = 'PRESENCE_USER_UPDATE';

// ------------------------------------
// Actions
// ------------------------------------
export function update(data) {
    return {
        type: PRESENCE_USER_UPDATE,
        data,
    };
}
