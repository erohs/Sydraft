import React from "react";
import "./Handle.css";

const Handle: React.FC<{ id: string; side: string }> = ({ id, side }) => {
  const handleClasses = `handle handle${side}`;
  return <div id={id} className={handleClasses} />;
};

export default Handle;
