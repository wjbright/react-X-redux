import * as types from "./actionTypes";

export function filterCoursesSuccess(filter) {
  return { type: types.FILTER_COURSES_SUCCESS, filter };
}
