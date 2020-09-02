import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faTools,
  faUserCircle,
  faBell,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <nav
      className="navbar is-dark"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a href="/" className="navbar-item">
          动车段帐项管理系统
        </a>

        <a
          role="button"
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="true"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-end">
          <a href="/" className="navbar-item">
            <FontAwesomeIcon icon={faHome} fixedWidth />
          </a>

          <a href="/setting" className="navbar-item">
            <FontAwesomeIcon icon={faTools} fixedWidth />
          </a>

          <a href="/message" className="navbar-item">
            <FontAwesomeIcon icon={faBell} fixedWidth />
            <span className="tag is-danger is-rounded">9</span>
          </a>

          <a href="/user" className="navbar-item">
            <FontAwesomeIcon icon={faUserCircle} fixedWidth />
            <span id="current-user"></span>
          </a>
        </div>
      </div>
    </nav>
  );
}
