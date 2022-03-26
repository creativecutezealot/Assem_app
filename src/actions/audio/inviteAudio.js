// ------------------------------------
// Constants
// ------------------------------------
export const INVITE_AUDIO_UPDATE = 'INVITE_AUDIO_UPDATE';

// ------------------------------------
// Actions
// ------------------------------------
export function update(data) {
    return {
        type: INVITE_AUDIO_UPDATE,
        data,
    };
}
