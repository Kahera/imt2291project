import { LOG_IN, LOG_OUT } from "./constants";

const initialState = {
    user: {
        uid: -1,
        email: null,
        userType: null,
        isStudent: false,
        isTeacher: false,
        isAdmin: false
    }
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case LOG_IN:
            //Update the state
            state = {
                ...state,
                user: action.details,
            }
            break;
        case LOG_OUT:
            //Reset the state
            state = {
                ...state,
                user: initialState
            }
            break;
        default:
            //Use existing state
            break;
    }
    return state;
};
export default rootReducer;
