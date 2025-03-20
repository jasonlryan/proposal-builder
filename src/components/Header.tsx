import React from "react";
import { NavLink } from "react-router-dom";
import "./styles/header.css";

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <h1 className="logo">BrilliantNoise</h1>
        <span className="logo-divider">|</span>
        <h2 className="product-name">Proposal Builder</h2>
      </div>
      <div className="header-actions">
        <nav className="builder-nav">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Builder
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Edit Components
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/help"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Help
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
