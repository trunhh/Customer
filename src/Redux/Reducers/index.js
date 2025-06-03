import { combineReducers } from "redux";

import LocationReducer from "./Category/Location";
import MainActionReducer from "../Reducers/MainAction";
const rootReducer = combineReducers({
    Location:LocationReducer,
    MainAction:MainActionReducer,
});

export default rootReducer;
