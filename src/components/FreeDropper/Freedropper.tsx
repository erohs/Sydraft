import React, { useState } from "react";
import DraggableImage from "../DraggableImage/DraggableImage";
import "./FreeDropper.css";

interface IImage {
  src: string;
  position: { x: number; y: number };
  zindex: number;
}

const FreeDropper: React.FC = () => {
  const [images, updateImages] = useState<IImage[]>([]);

  const retrieveData = (dT: DataTransfer) => {
    // var files = getFiles(dT);
    // if (files.length) {
    //   return files;
    // }

    var elems = getHTMLMarkup(dT);
    if (elems && elems.length) {
      return elems;
    }

    console.warn("unable to retrieve any image in dropped data");
  };

  function getHTMLMarkup(dT: DataTransfer) {
    var markup = dT.getData("text/html");
    if (markup) {
      var doc = new DOMParser().parseFromString(markup, "text/html");
      var imgs = (doc && doc.querySelectorAll("img,image")) || [];
      return Array.prototype.map.call(imgs, toImagesrc);
    }

    function toImagesrc(element: Element) {
      console.log(element);
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
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
    var srcs = retrieveData(e.dataTransfer);
    srcs?.forEach((src) => {
      var rect = e.currentTarget.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      updateImages([
        ...images,
        { src: src as string, position: { x: x, y: y }, zindex: images.length },
      ]);
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
    let oldImages = [...images];
    oldImages.forEach(function (image) {
      var index = sortedImages.findIndex((x) => x === image);
      if (index === -1) {
        image.zindex = oldImages.length - 1;
        return;
      }
      image.zindex = index;
    });
    updateImages(oldImages);
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
          position={image.position}
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
