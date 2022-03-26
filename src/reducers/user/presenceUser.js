import * as actions from '../../actions/user/presenceUser';

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    data: null,
};

export function presenceUser(state = initialState, action) {
    let newState = { ...state };
    switch (action.type) {
        case actions.PRESENCE_USER_UPDATE:
            if (state && state[action.data.user_id]) {
                newState = {
                    ...state,
                    [action.data.user_id]: {
                        ...state[action.data.user_id],
                        ...action.data,
                    },
                };
            } else {
                newState = { ...state, [action.data.user_id]: action.data };
            }
            return newState;
        default:
            return state;
    }
}
