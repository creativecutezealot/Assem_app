import * as actions from '../../actions/assemble/updateAssemble';

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export function assemblePATCH(state = initialState, action) {
    const id = action.payload ? action.payload.id : '';
    if (action.type === actions.PATCH_ASSEMBLE_REQUEST) {
        return {
            ...state,
            [id]: {
                loading: true,
                error: null,
                data: state && state[id] ? state[id].data : null,
            },
        };
    } else if (action.type === actions.PATCH_ASSEMBLE_SUCCESS) {
        return {
            ...state,
            [id]: {
                loading: false,
                error: null,
                data: action.data,
            },
        };
    } else if (action.type === actions.PATCH_ASSEMBLE_FAILED) {
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
