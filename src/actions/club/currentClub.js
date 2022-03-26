export const CURRENT_CLUB_UPDATE = 'CURRENT_CLUB_UPDATE';

// ------------------------------------
// Actions
// ------------------------------------
export function update(data) {
    return {
        type: CURRENT_CLUB_UPDATE,
        data,
    };
}
