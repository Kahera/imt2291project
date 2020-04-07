export const SELECT_TECHNOLOGY = 'SELECT_TECHNOLOGY';
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

//ACTION CREATORS

//Create an action for SELECT_TECHNOLOGY
export function selectTechnology(technology) {
    return {
        type: SELECT_TECHNOLOGY,
        chosen: technology
    }
}

//Create an action for INCREMENT_COUNTER
//TODO for students: Instead of counting the total number of clicks, 
//modify the code to count the number of clicks per button
export function incrementCounter() {
    return {
        type: INCREMENT_COUNTER
    }
}