import React from "react";
import Header from "../layout/Header";
import ComponentEditor from "./ComponentEditor";

const AdminRoute: React.FC = () => {
  return (
    <div className="admin-route">
      <Header />
      <ComponentEditor />
    </div>
  );
};

export default AdminRoute;
