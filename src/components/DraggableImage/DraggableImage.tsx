import React, { useState, useEffect } from "react";
import "./DraggableImage.css";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

interface IDraggableImageProps {
  src: string;
  position: {
    x: number;
    y: number;
  };
  className?: string;
  index: number;
  zindex: number;
  reorder: (index: number) => void;
}

const DraggableImage: React.FC<IDraggableImageProps> = ({
  src,
  position,
  className,
  index,
  zindex,
  reorder,
}) => {
  const [pos, setPos] = useState(position);
  const [divHeight, setDivHeight] = useState(0);
  const [divWidth, setDivWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);
  const [canDrag, setCanDrag] = useState(true);

  const onStop = (event: DraggableEvent, data: DraggableData) => {
    setPos({ x: data.x, y: data.y });
  };

  const onDoubleClick = () => {
    reorder(index);
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY < 0) {
      const newWidth = imgWidth * 1.1;
      const newHeight = imgHeight * 1.1;
      setImgWidth(newWidth);
      setImgHeight(newHeight);
    } else {
      const newWidth = imgWidth * 0.9;
      const newHeight = imgHeight * 0.9;
      setImgWidth(newWidth);
      setImgHeight(newHeight);
    }
  };

  useEffect(() => {
    let img = new Image();

    img.onload = function () {
      var height = img.naturalHeight;
      var width = img.naturalWidth;
      setDivHeight(height);
      setDivWidth(width);
      setImgHeight(height);
      setImgWidth(width);
    };

    img.src = src;
  }, []);

  const classname = `draggable-image ${className}`;

  return (
    <Draggable
      position={pos}
      onStop={(event, data) => onStop(event, data)}
      cancel={".react-resizable-handle"}
    >
      <Resizable
        onResize={(e, data) => {
          setDivWidth(data.size.width);
          setDivHeight(data.size.height);
        }}
        width={divWidth}
        height={divHeight}
        className="draggable-image__resizable"
      >
        <div
          className="dragable-image__container"
          style={{ width: divWidth + "px", height: divHeight + "px", zIndex: zindex }}
          onDoubleClick={() => onDoubleClick()}
          onWheel={(event) => onWheel(event)}
          onContextMenu={(event) => {
            event.preventDefault();
            return false;
          }}
        >
          <Draggable
            allowAnyClick={true}
            onMouseDown={(event) => {
              setCanDrag(event.button === 2);
            }}
            onDrag={() => {
              if (!canDrag) {
                return false;
              }
            }}
          >
            <img
              draggable="false"
              className={classname}
              src={src}
              width={imgWidth}
              height={imgHeight}
            />
          </Draggable>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default DraggableImage;
