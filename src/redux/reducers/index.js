import { combineReducers } from "redux";
import courses from "./courseReducer";
import authors from "./authorReducer";
import filter from "./filterReducer";
import apiCallsInProgress from "./apiStatusReducer";

const rootReducer = combineReducers({
  courses,
  authors,
  filter,
  apiCallsInProgress
});

export default rootReducer;
