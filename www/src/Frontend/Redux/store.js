import { createStore } from '../../../node_modules/redux';
import rootReducer from './reducer';

const store = createStore(rootReducer);

export default store;