import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LibraryProvider } from "./context/LibraryContext";
import { ProposalProvider } from "./context/ProposalContext";
import ProposalBuilder from "./components/ProposalBuilder";
import AdminRoute from "./components/admin/AdminRoute";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="main-content">
          <LibraryProvider>
            <ProposalProvider>
              <Routes>
                <Route path="/" element={<ProposalBuilder />} />
                <Route path="/admin" element={<AdminRoute />} />
                {/* Additional routes can be added here */}
                <Route
                  path="/dashboard"
                  element={
                    <div className="page-placeholder">
                      Dashboard Coming Soon
                    </div>
                  }
                />
                <Route
                  path="/templates"
                  element={
                    <div className="page-placeholder">
                      Templates Coming Soon
                    </div>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <div className="page-placeholder">
                      Help Center Coming Soon
                    </div>
                  }
                />
              </Routes>
            </ProposalProvider>
          </LibraryProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
