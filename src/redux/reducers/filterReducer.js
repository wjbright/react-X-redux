import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function filterReducer(state = initialState.filter, action) {
  switch (action.type) {
    case types.FILTER_COURSES_SUCCESS:
      return state = action.filter;
    default:
      return state;
  }
}
