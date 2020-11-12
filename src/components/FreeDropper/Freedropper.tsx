import React, { useState } from "react";
import DraggableImage from "../DraggableImage/DraggableImage";
import "./FreeDropper.css";

interface ICoords {
  x: number;
  y: number;
}

interface ISize {
  width: number;
  height: number;
}

interface IImage {
  src: string;
  initDivPos: ICoords;
  initImgPos: ICoords;
  initDivSize: ISize;
  initImgSize: ISize;
  zindex: number;
}

const FreeDropper: React.FC = () => {
  const [images, updateImages] = useState<IImage[]>([]);

  const retrieveData = (dT: DataTransfer) => {
    // var files = getFiles(dT);
    // if (files.length) {
    //   return files;
    // }

    const elems = getHTMLMarkup(dT);
    if (elems && elems.length) {
      return elems;
    }

    console.warn("unable to retrieve any image in dropped data");
  };

  const getImgSrc = (element: Element) => {
    var src: string | null;
    if (element instanceof SVGImageElement) {
      src =
        element.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
        element.getAttribute("href");
    } else {
      const img: HTMLImageElement = document.adoptNode(element) as HTMLImageElement;
      src = img.src;
    }

    return src;
  };

  const getHTMLMarkup = (dT: DataTransfer) => {
    const markup = dT.getData("text/html");

    if (markup) {
      const doc = new DOMParser().parseFromString(markup, "text/html");
      const imgs = (doc && doc.querySelectorAll("img,image")) || [];
      return Array.prototype.map.call(imgs, getImgSrc);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
    let srcs = retrieveData(e.dataTransfer);
    srcs?.forEach((src) => {
      let img = new Image();

      img.onload = function () {
        const size = { width: img.naturalWidth, height: img.naturalHeight };
        const position = { x: e.clientX - size.width / 2, y: e.clientY - size.height / 2 };
        const image: IImage = {
          src: src as string,
          initDivPos: position,
          initImgPos: { x: 0, y: 0 },
          initDivSize: size,
          initImgSize: size,
          zindex: images.length,
        };
        updateImages([...images, image]);
      };

      img.src = src as string;
    });
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
  };

  const reorder = (index: number) => {
    let removedImages = [...images];
    removedImages.splice(index, 1);
    const sortedImages = removedImages.sort(function (a, b) {
      return a.zindex === b.zindex ? 0 : +(a.zindex > b.zindex) || -1;
    });
    let newImages = [...images];
    newImages.forEach(function (image) {
      var index = sortedImages.findIndex((x) => x === image);
      if (index === -1) {
        image.zindex = newImages.length - 1;
        return;
      }
      image.zindex = index;
    });
    updateImages(newImages);
  };

  return (
    <div
      className="free-dropper"
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}
      onDragLeave={(e) => handleDragLeave(e)}
    >
      {images.map((image, index) => (
        <DraggableImage
          src={image.src}
          initDivPos={image.initDivPos}
          initImgPos={image.initImgPos}
          initDivSize={image.initDivSize}
          initImgSize={image.initImgSize}
          key={index}
          index={index}
          zindex={image.zindex}
          reorder={reorder}
        />
      ))}
    </div>
  );
};

export default FreeDropper;
