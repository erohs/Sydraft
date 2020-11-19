import React from "react";
import FreeDropper from "../../components/FreeDropper/Freedropper";
import { getBounds, checkCoords } from "../../Helpers/PositionHelper";
import { IBoardState } from "./interfaces/IBoardState";
import "./Board.css";

class Board extends React.Component {
  state: IBoardState = {
    zoom: 1,
    position: {
      x: -5000 + document.documentElement.clientWidth / 2,
      y: -5000 + document.documentElement.clientHeight / 2,
    },
    offset: { x: 0, y: 0 },
    isInteracting: false,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown, true);
    window.addEventListener("keyup", this.handleKeyUp, true);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown, true);
    window.removeEventListener("keyup", this.handleKeyUp, true);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      this.setState({ isInteracting: true });
    }
  };

  handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      this.setState({ isInteracting: false });
    }
  };

  handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.setState({
      offset: {
        x: event.pageX - this.state.position.x,
        y: event.pageY - this.state.position.y,
      },
    });

    window.addEventListener("mousemove", this.handleMouseMove, true);
    window.addEventListener("mouseup", this.handleMouseUp, false);
  };

  handleMouseUp = () => {
    window.removeEventListener("mousemove", this.handleMouseMove, true);
    window.removeEventListener("mouseup", this.handleMouseUp, false);
  };

  scale = (at: { x: number; y: number }, amount: number) => {
    const [topBounds, rightBounds, bottomBounds, leftBounds] = getBounds(this.state.zoom * amount);
    let zoom = this.state.zoom;

    if (rightBounds - leftBounds < 0 && bottomBounds - topBounds < 0) {
      zoom = zoom * amount;
    }

    this.setState({ zoom: zoom }, () => {
      const x = at.x - (at.x - this.state.position.x) * amount;
      const y = at.y - (at.y - this.state.position.y) * amount;

      const [checkedX, checkedY] = checkCoords(x, y, this.state.zoom);

      this.setState({
        position: {
          x: checkedX,
          y: checkedY,
        },
      });
    });
  };

  handleMouseMove = (event: MouseEvent) => {
    if (!this.state.isInteracting) return false;

    const x = event.pageX - this.state.offset.x;
    const y = event.pageY - this.state.offset.y;

    const [checkedX, checkedY] = checkCoords(x, y, this.state.zoom);

    this.setState({
      position: {
        x: checkedX,
        y: checkedY,
      },
    });
  };

  handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!this.state.isInteracting) return false;

    const x = event.pageX - event.currentTarget.clientWidth / 2;
    const y = event.pageY - event.currentTarget.clientHeight / 2;
    if (event.deltaY < 0) {
      this.scale({ x, y }, 1.1);
    } else {
      this.scale({ x, y }, 1 / 1.1);
    }
  };

  render() {
    let style = {
      transform: `matrix(${this.state.zoom}, 0, 0, ${this.state.zoom}, ${this.state.position.x}, ${this.state.position.y})`,
    };
    let classname = "board";

    if (this.state.isInteracting) {
      classname = "board interacting";
    }

    return (
      <div className="board__container">
        <div
          className={classname}
          style={style}
          onWheel={(event) => this.handleWheel(event)}
          onMouseDown={(event) => this.handleMouseDown(event)}
        >
          <FreeDropper zoom={this.state.zoom} disable={this.state.isInteracting} />
        </div>
      </div>
    );
  }
}

export default Board;
