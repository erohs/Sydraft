import React from "react";
import { IHandleProps } from "./interfaces/IHandleProps";
import "./Handle.css";

class Handle extends React.Component<IHandleProps> {
  render() {
    const handleClasses = `handle handle${this.props.side}`;
    return (
      <div
        id={this.props.id}
        className={handleClasses}
        draggable={false}
        onMouseDown={this.props.handleMouseDown}
      />
    );
  }
}

export default Handle;
