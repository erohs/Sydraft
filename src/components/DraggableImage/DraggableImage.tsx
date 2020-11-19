import React from "react";
import { IDraggableImageProps } from "./interfaces/IDraggableImageProps";
import { IDraggableImageState } from "./interfaces/IDraggableImageState";
import { checkImageCoords } from "../../Helpers/PositionHelper";
import "./DraggableImage.css";

class DraggableImage extends React.Component<IDraggableImageProps> {
  private container = React.createRef<HTMLDivElement>();

  state: IDraggableImageState = {
    offset: { x: 0, y: 0 },
    button: 0,
    canDrag: true,
  };

  handleMouseUp = (event: MouseEvent) => {
    window.removeEventListener("mouseup", this.handleMouseUp, false);
    window.removeEventListener("mousemove", this.handleMouseMove, true);
  };

  handleMouseMove = (event: MouseEvent) => {
    if (this.props.disable || this.state.button === 1 || !this.state.canDrag) return false;

    const x = event.pageX / this.props.zoom - this.state.offset.x;
    const y = event.pageY / this.props.zoom - this.state.offset.y;

    if (this.state.button === 0) {
      const [checkedX, checkedY] = checkImageCoords(x, y, this.props.image.divSize);

      this.props.image.divPosition = {
        x: checkedX,
        y: checkedY,
      };
      this.props.updateImage(this.props.index, this.props.image);
    } else if (this.state.button === 2) {
      this.props.image.imgPosition = {
        x: x,
        y: y,
      };
      this.props.updateImage(this.props.index, this.props.image);
    }
  };

  handleDoubleClick = () => {
    this.props.reorderImages(this.props.index);
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Delete") {
      this.props.deleteImage(this.props.index);
    }
  };

  handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (this.props.disable) return false;

    if (event.deltaY < 0) {
      this.props.image.imgSize = {
        width: this.props.image.imgSize.width * 1.1,
        height: this.props.image.imgSize.height * 1.1,
      };
      this.props.updateImage(this.props.index, this.props.image);
    } else {
      this.props.image.imgSize = {
        width: this.props.image.imgSize.width * 0.9,
        height: this.props.image.imgSize.height * 0.9,
      };
      this.props.updateImage(this.props.index, this.props.image);
    }
  };

  handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    window.addEventListener("mousemove", this.handleMouseMove, true);
    window.addEventListener("mouseup", this.handleMouseUp, false);

    if (event.button === 0) {
      this.setState({
        offset: {
          x: event.pageX / this.props.zoom - this.props.image.divPosition.x,
          y: event.pageY / this.props.zoom - this.props.image.divPosition.y,
        },
        button: event.button,
      });
    } else if (event.button === 2) {
      this.setState({
        offset: {
          x: event.pageX / this.props.zoom - this.props.image.imgPosition.x,
          y: event.pageY / this.props.zoom - this.props.image.imgPosition.y,
        },
        button: event.button,
      });
    }
  };

  handleStartResize = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    this.setState({ canDrag: false });
    window.addEventListener("mousemove", this.handleResize, true);
    window.addEventListener("mouseup", this.handleStopResize, false);
  };

  handleResize = (event: MouseEvent) => {
    let width = this.props.image.divSize.width + event.movementX / this.props.zoom;
    let height = this.props.image.divSize.height + event.movementY / this.props.zoom;

    if (width < 25) width = 25;
    if (height < 25) height = 25;

    this.props.image.divSize = { width: width, height: height };
    this.props.updateImage(this.props.index, this.props.image);
  };

  handleStopResize = () => {
    this.setState({ canDrag: true });
    window.removeEventListener("mousemove", this.handleResize, true);
    window.removeEventListener("mouseup", this.handleStopResize, false);
  };

  render() {
    const classname = `draggable-image ${this.props.className}`;
    const divStyle = {
      transform: `translate(${this.props.image.divPosition.x}px, ${this.props.image.divPosition.y}px)`,
      width: `${this.props.image.divSize.width}px`,
      height: `${this.props.image.divSize.height}px`,
    };
    const imgStyle = {
      transform: `translate(${this.props.image.imgPosition.x}px, ${this.props.image.imgPosition.y}px)`,
    };
    return (
      <div
        className="draggable-image__container"
        ref={this.container}
        tabIndex={0}
        style={divStyle}
        onDoubleClick={() => this.handleDoubleClick()}
        onWheel={(event) => this.handleWheel(event)}
        onKeyDown={(event) => this.handleKeyDown(event)}
        onMouseDown={(event) => this.handleMouseDown(event)}
        onContextMenu={(event) => {
          event.preventDefault();
          return false;
        }}
      >
        <img
          draggable="false"
          style={imgStyle}
          className={classname}
          src={this.props.image.src}
          width={this.props.image.imgSize.width}
          height={this.props.image.imgSize.height}
          alt=""
        />
        <span
          draggable="false"
          className="draggable-image__resize-handler se"
          onMouseDown={(event) => this.handleStartResize(event)}
        />
      </div>
    );
  }
}

export default DraggableImage;
