import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LibraryProvider } from "./context/LibraryContext";
import { ProposalProvider } from "./context/ProposalContext";
import ProposalBuilder from "./components/ProposalBuilder";
import AdminRoute from "./components/admin/AdminRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <LibraryProvider>
          <ProposalProvider>
            <Routes>
              <Route path="/" element={<ProposalBuilder />} />
              <Route path="/admin" element={<AdminRoute />} />
              {/* Additional routes can be added here */}
            </Routes>
          </ProposalProvider>
        </LibraryProvider>
      </div>
    </Router>
  );
}

export default App;
