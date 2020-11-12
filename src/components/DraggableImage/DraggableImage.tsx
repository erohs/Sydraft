import React, { useState } from "react";
import { IDraggableImageProps } from "./interfaces/IDraggableImageProps";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable } from "react-resizable";
import "./DraggableImage.css";
import "react-resizable/css/styles.css";

const DraggableImage: React.FC<IDraggableImageProps> = ({
  image,
  index,
  className,
  reorderImages,
  updateImage,
  deleteImage,
}) => {
  const [canDrag, setCanDrag] = useState(true);

  const onDivStop = (event: DraggableEvent, data: DraggableData) => {
    image.divPosition = { x: data.x, y: data.y };
    updateImage(index, image);
  };

  const onImgStop = (event: DraggableEvent, data: DraggableData) => {
    if (canDrag) {
      image.imgPosition = { x: data.x, y: data.y };
      updateImage(index, image);
    }
  };

  const onDoubleClick = () => {
    reorderImages(index);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Delete") {
      deleteImage(index);
    }
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY < 0) {
      image.imgSize = { width: image.imgSize.width * 1.1, height: image.imgSize.height * 1.1 };
      updateImage(index, image);
    } else {
      image.imgSize = { width: image.imgSize.width * 0.9, height: image.imgSize.height * 0.9 };
      updateImage(index, image);
    }
  };

  const classname = `draggable-image ${className}`;

  return (
    <Draggable
      position={image.divPosition}
      onStop={(event, data) => onDivStop(event, data)}
      cancel={".react-resizable-handle"}
    >
      <Resizable
        onResize={(event, data) => {
          image.divSize = { width: data.size.width, height: data.size.height };
          updateImage(index, image);
        }}
        width={image.divSize.width}
        height={image.divSize.height}
        className="draggable-image__resizable"
      >
        <div
          className="dragable-image__container"
          tabIndex={0}
          style={{
            width: `${image.divSize.width}px`,
            height: `${image.divSize.height}px`,
          }}
          onDoubleClick={() => onDoubleClick()}
          onWheel={(event) => onWheel(event)}
          onKeyDown={(event) => onKeyDown(event)}
          onContextMenu={(event) => {
            event.preventDefault();
            return false;
          }}
        >
          <Draggable
            position={image.imgPosition}
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
              src={image.src}
              width={image.imgSize.width}
              height={image.imgSize.height}
              alt=""
            />
          </Draggable>
        </div>
      </Resizable>
    </Draggable>
  );
};

export default DraggableImage;
