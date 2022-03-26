import * as actions from '../../actions/club/getClubByUserId';
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export function clubsByUserGET(state = initialState, action) {
    const id = action.payload ? action.payload.id : '';
    if (action.type === actions.GET_CLUB_BY_USER_REQUEST) {
        return {
            ...state,
            [id]: {
                loading: true,
                error: null,
                data: state && state[id] ? state[id].data : null,
            },
        };
    } else if (action.type === actions.GET_CLUB_BY_USER_SUCCESS) {
        return {
            ...state,
            [id]: {
                loading: false,
                error: null,
                data: action.data,
            },
        };
    } else if (action.type === actions.GET_CLUB_BY_USER_FAILED) {
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
