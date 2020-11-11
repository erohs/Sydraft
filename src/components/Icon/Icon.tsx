import React from "react";

const Icon: React.FC<{ source: string }> = ({ source }) => {
  return <span dangerouslySetInnerHTML={{ __html: source.toString() }} />;
};

export default Icon;
