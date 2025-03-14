import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="flex items-center">
          <h1 className="header-title">Proposal Builder</h1>
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Builder
          </Link>
          <Link to="/admin" className="nav-link">
            Edit Components
          </Link>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/templates" className="nav-link">
            Templates
          </Link>
          <Link to="/help" className="nav-link">
            Help
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
