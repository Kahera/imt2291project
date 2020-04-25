import { LOG_IN } from "./constants";
import { LOG_OUT } from "./constants";

export function action_login(user) {
    return {
        type: LOG_IN,
        details: user
    }
}

export function action_logout() {
    return {
        type: LOG_OUT
    }
}

export function register() {
    return {
        type: register,
        details: user
    }
}