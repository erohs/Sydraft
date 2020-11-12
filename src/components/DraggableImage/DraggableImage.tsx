import React, { useState } from "react";
import "./DraggableImage.css";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

interface ICoords {
  x: number;
  y: number;
}

interface ISize {
  width: number;
  height: number;
}

interface IDraggableImageProps {
  src: string;
  initDivPos: ICoords;
  initImgPos: ICoords;
  initDivSize: ISize;
  initImgSize: ISize;
  index: number;
  zindex: number;
  className?: string;
  reorder: (index: number) => void;
}

const DraggableImage: React.FC<IDraggableImageProps> = ({
  src,
  initDivPos,
  initImgPos,
  initDivSize,
  initImgSize,
  index,
  zindex,
  className,
  reorder,
}) => {
  const [divPos, setDivPos] = useState(initDivPos);
  const [imgPos, setImgPos] = useState(initImgPos);
  const [divSize, setDivSize] = useState(initDivSize);
  const [imgSize, setImgSize] = useState(initImgSize);
  const [canDrag, setCanDrag] = useState(true);

  const onDivStop = (event: DraggableEvent, data: DraggableData) => {
    setDivPos({ x: data.x, y: data.y });
  };

  const onImgStop = (event: DraggableEvent, data: DraggableData) => {
    if (canDrag) {
      setImgPos({ x: data.x, y: data.y });
    }
  };

  const onDoubleClick = () => {
    reorder(index);
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY < 0) {
      const newWidth = imgSize.width * 1.1;
      const newHeight = imgSize.height * 1.1;
      setImgSize({ width: newWidth, height: newHeight });
    } else {
      const newWidth = imgSize.width * 0.9;
      const newHeight = imgSize.height * 0.9;
      setImgSize({ width: newWidth, height: newHeight });
    }
  };

  const classname = `draggable-image ${className}`;

  return (
    <Draggable
      position={divPos}
      onStop={(event, data) => onDivStop(event, data)}
      cancel={".react-resizable-handle"}
    >
      <Resizable
        onResize={(e, data) => {
          setDivSize({ width: data.size.width, height: data.size.height });
        }}
        width={divSize.width}
        height={divSize.height}
        className="draggable-image__resizable"
      >
        <div
          className="dragable-image__container"
          style={{ width: divSize.width + "px", height: divSize.height + "px", zIndex: zindex }}
          onDoubleClick={() => onDoubleClick()}
          onWheel={(event) => onWheel(event)}
          onContextMenu={(event) => {
            event.preventDefault();
            return false;
          }}
        >
          <Draggable
            position={imgPos}
            allowAnyClick={true}
            onMouseDown={(event) => {
              setCanDrag(event.button === 2);
            }}
            onDrag={() => {
              if (!canDrag) {
                return false;
              }
            }}
            onStop={(event, data) => onImgStop(event, data)}
          >
            <img
              draggable="false"
              className={classname}
              src={src}
              width={imgSize.width}
              height={imgSize.height}
            />
          </Draggable>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default DraggableImage;
