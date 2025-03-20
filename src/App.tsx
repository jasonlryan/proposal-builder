import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LibraryProvider } from "./context/LibraryContext";
import { ProposalProvider } from "./context/ProposalContext";
import ProposalBuilder from "./components/ProposalBuilder";
import AdminRoute from "./components/admin/AdminRoute";
import Header from "./components/Header";
import HelpCenter from "./components/HelpCenter";
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
                {/* Using the actual HelpCenter component */}
                <Route path="/help" element={<HelpCenter />} />
              </Routes>
            </ProposalProvider>
          </LibraryProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
