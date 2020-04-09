import { LOG_IN } from "./constants";
import { LOG_OUT } from "./constants";

export function logIn(user) {
    return {
        type: LOG_IN,
        details: user
    }
}

export function logOut() {
    return {
        type: LOG_OUT
    }
}
