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
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/templates"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Templates
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
        <div className="cart">
          <span className="cart-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C18.0391 17.2107 17.5304 17 17 17Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="cart-count">0</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
