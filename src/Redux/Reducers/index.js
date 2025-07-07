import { combineReducers } from "redux";

import LocationReducer from "./Category/Location";
import MainActionReducer from "../Reducers/MainAction";
import SessionReducer from "./System/SessionReducer";
const rootReducer = combineReducers({
    Location:LocationReducer,
    MainAction:MainActionReducer,
    Session : SessionReducer,
});

export default rootReducer;
