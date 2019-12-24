import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const AuthorList = ({ authors, courses, onDeleteClick }) => (
  <table className="table">
    <thead>
      <tr>
        <th />
        <th>Author</th>
        <th>Number of Courses</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {authors.map(author => {
        return (
          <tr key={author.id}>
            <td>
              <a
                className="btn btn-light"
                href={"http://pluralsight.com/authors/" + author.id}
              >
                Courses
              </a>
            </td>
            <td>
              <Link to={"/author/" + author.id}>{author.name}</Link>
            </td>
            <td>{courses.reduce((count, course) => {
              if (course.authorId === author.id) {
                  return count  + 1
              } else return count + 0
            }, 0)
            }</td>
            <td>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDeleteClick(author)}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

AuthorList.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

export default AuthorList;
