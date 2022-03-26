// ------------------------------------
// Constants
// ------------------------------------
export const INVITE_ASSEMBLE_UPDATE = 'INVITE_ASSEMBLE_UPDATE';

// ------------------------------------
// Actions
// ------------------------------------
export function update(data) {
    return {
        type: INVITE_ASSEMBLE_UPDATE,
        data,
    };
}
