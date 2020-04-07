import { SELECT_TECHNOLOGY, INCREMENT_COUNTER } from "./actions";

/*
Remember that in Redux the state is stored as a single object. 
In this application the state will contain 2 different properties:
    - The number of clicks
    - The last technology selected
    {
        selectedTechnology: String,
        clickCounter: Number
    }
*/

//Initial state
const initialState = {
    selectedTechnology: "",
    clickCounter: 0
};

function rootReducer(state = initialState, action) {
    /*
    NOTICE THAT ...state is and ECMAScript 6 specification "Object Rest/Spread Properties for ECMAScript"
    https://github.com/tc39/proposal-object-rest-spread#spread-properties
    Run the following JS in the javascript console to understand the behaviour
    1)
        var state = {
            selectedTechnology: "Javascript",
            clickCounter: 0
        };
    2)
        var state2 = {...state, clickCounter:2}
    3)
        var state3 = {...state2, selectedTechnology: "Polymer"}
    4) check the value of state, state2 and state3
        state
        state2
        state3
    */
    //action will always contain the type attribute
    switch (action.type) {
        //If the action is "SELECT_TECHNOLOGY" we create a copy of the previous state
        //we create a new state with the new selectedTechnology (that is stored in the action.chosen property)
        //and, finally, we return the new state that will be handled by the store
        case SELECT_TECHNOLOGY:
            return { ...state, selectedTechnology: action.chosen }
        case INCREMENT_COUNTER:
            return { ...state, clickCounter: state.clickCounter + 1 }
        default:
            return state;
    }
}

export default rootReducer;