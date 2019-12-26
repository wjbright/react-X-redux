import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadCourses, saveCourse } from "../../redux/actions/courseActions";
import { loadAuthors } from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

export function ManageCoursePage({
  courses,
  authors,
  loadAuthors,
  loadCourses,
  saveCourse,
  history,
  hasSlug,
  ...props
}) {
  const [course, setCourse] = useState({ ...props.course });
  const [numberOfUpdates, setNumberOfUpdates] = useState(0);
  const [prevCourse, setPrevCourse] = useState({ ...props.course });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hasSlug) {
      history.push("/pageNotFound")
    }
  })

  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert("Loading courses failed" + error);
      });
    } else {
      setCourse({ ...props.course });
    }

    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("Loading authors failed" + error);
      });
    }

  }, [props.course]);

  useEffect(() => {
    const unblock = history.block(() => {
      if (formHasChanges()) {
        return "You have unsaved changes, do you still want to leave?"
      } else return null
    })
    return () => {
        unblock()
      }
  })

  // I am not sure wheter this is a good fix for the bug below, but oh well... till it breaks...
  useEffect(() => {
    setNumberOfUpdates(prevNumber => prevNumber + 1);
  }, [course])

  useEffect(() => {
    if (numberOfUpdates < 3) {
      setPrevCourse({
        ...course
      })
    }
    console.log(numberOfUpdates)
  },[course, numberOfUpdates])

  // Bug: When browser refreshes , the default state of course is set to prevCourse even if the form is populated
  function formHasChanges() {
    const { title, authorId, category } = course;
    console.log({prevCourse, course})
    let unsavedChanges = [];
    if (title !== "" && prevCourse.title !== course.title) unsavedChanges.push(title);
    if (authorId !== null && prevCourse.authorId !== course.authorId) unsavedChanges.push(authorId);
    if (category !== "" && prevCourse.category !== course.category) unsavedChanges.push(category);
    
    return unsavedChanges.length > 0;
  }

  function formIsValid() {
    const { title, authorId, category } = course;
    const errors = {};

    if (!title) errors.title = "Title is required.";
    if (!authorId) errors.author = "Author is required";
    if (!category) errors.category = "Category is required";

    let regex = RegExp("/(?!^[_-].+)(?!.+[_-]$)(?!.*[_-]{2,})[^<>[\\]{}|\\\\\\/^~%# :;,$%?\\0-\\cZ]+$/gm");
    if (!regex.test(title)) errors.title = "No special charaters allowed";
    if (!regex.test(category)) errors.category = "No special charaters allowed"

    setErrors(errors);
    // Form is valid if the errors object still has no properties
    return Object.keys(errors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === "authorId" ? parseInt(value, 10) : value
    }));
    setPrevCourse(prev => ({
      ...prev
    }))

    setNumberOfUpdates(prevNumber => prevNumber + 1);
  }

  function handleSave(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    setSaving(true);
    saveCourse(course)
      .then(() => {
        toast.success("Course saved.");
        history.push("/courses");
      })
      .catch(error => {
        setSaving(false);
        setErrors({ onSave: error.message });
      });
  }

  return authors.length === 0 || courses.length === 0 ? (
    <Spinner />
  ) : (
    <CourseForm
      course={course}
      errors={errors}
      authors={authors}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
    />
  );
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  hasSlug: PropTypes.bool.isRequired
};

export function getCourseBySlug(courses, slug) {
  return courses.find(course => course.slug === slug) || null;
}

export function slugIsValid(courses, slug) {
  // A slug is valid when it can be found in the array of courses
  return courses.find(course => course.slug === slug)
}

function mapStateToProps(state, ownProps) {
  const slug = ownProps.match.params.slug;
  const hasSlug = slugIsValid(state.courses, slug)
  const course =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : newCourse
  return {
    course,
    hasSlug,
    courses: state.courses,
    authors: state.authors
  };
}

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  saveCourse
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCoursePage);
