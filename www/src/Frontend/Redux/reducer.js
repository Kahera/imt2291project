import { LOG_IN, LOG_OUT } from "./constants";

const initialState = {
    user: { 

     }
};

function rootReducer(state = initialState, action) {
    if (action.type === LOG_IN) {
        state = {
            ...state,
            user: action.details
        }
    } else if (action.type === LOG_OUT) {
        state = {
            ...state,
            user: { 
                
             }
        }
    }
    return state;
};

export default rootReducer;
