import { combineReducers } from "redux";
import userReducer from "./slices/user.jsx"
import brandReducer from "./slices/brands.jsx"

const appReducer = combineReducers({
    user: userReducer,
    brand: brandReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_STORE') {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
