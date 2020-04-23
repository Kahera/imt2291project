import { LOG_IN } from "./constants";
import { LOG_OUT } from "./constants";

export function login(user) {
    return {
        type: LOG_IN,
        details: user
    }
}

export function logout() {
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
