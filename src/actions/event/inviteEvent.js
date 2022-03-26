// ------------------------------------
// Constants
// ------------------------------------
export const INVITE_EVENT_UPDATE = 'INVITE_EVENT_UPDATE';

// ------------------------------------
// Actions
// ------------------------------------
export function update(data) {
    return {
        type: INVITE_EVENT_UPDATE,
        data,
    };
}
