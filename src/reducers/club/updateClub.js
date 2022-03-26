import * as actions from '../../actions/club/updateClub';

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export function clubPATCH(state = initialState, action) {
    const id = action.payload ? action.payload.id : '';
    if (action.type === actions.PATCH_CLUB_REQUEST) {
        return {
            ...state,
            [id]: {
                loading: true,
                error: null,
                data: state && state[id] ? state[id].data : null,
            },
        };
    } else if (action.type === actions.PATCH_CLUB_SUCCESS) {
        return {
            ...state,
            [id]: {
                loading: false,
                error: null,
                data: action.data,
            },
        };
    } else if (action.type === actions.PATCH_CLUB_FAILED) {
        return {
            ...state,
            [id]: {
                loading: false,
                error: action.error,
                data: state && state[id] ? state[id].data : null,
            },
        };
    } else {
        return state;
    }
}
