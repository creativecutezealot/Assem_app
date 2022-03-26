// ------------------------------------
// Constants
// ------------------------------------
export const INVITE_VOICENOTE_UPDATE = 'INVITE_VOICENOTE_UPDATE';

// ------------------------------------
// Actions
// ------------------------------------
export function update(data) {
    return {
        type: INVITE_VOICENOTE_UPDATE,
        data,
    };
}
