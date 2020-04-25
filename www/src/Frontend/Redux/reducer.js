import { LOG_IN, LOG_OUT } from "./constants";

const initialState = {
    user: {
        uid: -1,
        email: null,
        isStudent: false,
        isTeacher: false,
        isAdmin: false
    }
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case LOG_IN:
            //Update the state
            return {
                ...state,
                ...action.details,
            }

        case LOG_OUT:
            //Reset the state
            return {
                ...state,
                ...USER_INITIAL_STATE
            }

        default:
            //Use existing state
            return state
    }
};

export default rootReducer;
