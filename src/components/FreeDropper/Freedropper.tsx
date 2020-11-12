import React, { useState, useEffect } from "react";
import { IImage } from "../../types";
import DraggableImage from "../DraggableImage/DraggableImage";
import "./FreeDropper.css";

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
          divPosition: position,
          imgPosition: { x: 0, y: 0 },
          divSize: size,
          imgSize: size,
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

  const reorderImages = (index: number) => {
    let newImages = [...images];
    const tempImage: IImage = newImages[index];
    newImages.splice(index, 1);
    newImages.push(tempImage);
    updateImages(newImages);
  };

  const updateImage = (index: number, image: IImage) => {
    let newImages = [...images];
    newImages[index] = image;
    updateImages(newImages);
  };

  const deleteImage = (index: number) => {
    let newImages = [...images];
    newImages.splice(index, 1);
    updateImages(newImages);
  };

  useEffect(() => {}, [images]);

  return (
    <div
      className="free-dropper"
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}
      onDragLeave={(e) => handleDragLeave(e)}
    >
      {images.map((image, index) => (
        <DraggableImage
          image={image}
          key={index}
          index={index}
          reorderImages={reorderImages}
          updateImage={updateImage}
          deleteImage={deleteImage}
        />
      ))}
    </div>
  );
};

export default FreeDropper;
