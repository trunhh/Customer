import { combineReducers } from "redux";

import TestActionReducer from "./TestActionReducer";

const rootReducer = combineReducers({
    Test:TestActionReducer
});

export default rootReducer;
