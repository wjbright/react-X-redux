import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types"

const Header = ({coursesCount}) => {
  const activeStyle = { color: "#F15B2A" };
  return (
    <nav>
      <NavLink to="/" activeStyle={activeStyle} exact>
        Home
      </NavLink>
      {" | "}
      <NavLink to="/courses" activeStyle={activeStyle}>
        Courses
        {" - "}
        <h6 Style={"display: inline"}>{coursesCount}</h6>
      </NavLink>
      {" | "}
      <NavLink to="/authors" activeStyle={activeStyle}>
        Authors
      </NavLink>
      {" | "}
      <NavLink to="/about" activeStyle={activeStyle}>
        About
      </NavLink>
    </nav>
  );
};

Header.propTypes = {
  coursesCount: PropTypes.number.isRequired,
} 

function mapStateToProps(state) {
  return {coursesCount: state.courses.length || 0}
}

export default connect(mapStateToProps)(Header);
