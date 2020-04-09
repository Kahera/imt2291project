import store from "../Redux/store"

const navigate = path => {
    store.dispatch(route(path))
}

export default navigate