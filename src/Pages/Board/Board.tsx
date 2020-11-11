import React from "react";
import FreeDropper from "../../components/FreeDropper/Freedropper";
import "./Board.css";

class Board extends React.Component {
  render() {
    return (
      <div className="board">
        <FreeDropper />
      </div>
    );
  }
}

export default Board;
