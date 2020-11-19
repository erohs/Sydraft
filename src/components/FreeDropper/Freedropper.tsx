import React from "react";
import DraggableImage from "../DraggableImage/DraggableImage";
import { IFreeDropperProps } from "./interfaces/IFreeDropperProps";
import { IFreeDropperState } from "./interfaces/IFreeDropperState";
import { IImage } from "../../types";
import "./FreeDropper.css";

class FreeDropper extends React.Component<IFreeDropperProps> {
  state: IFreeDropperState = {
    images: [],
  };

  retrieveData = (dT: DataTransfer) => {
    const files = this.getFiles(dT);
    if (files.length) {
      return files;
    }

    const elems = this.getHTMLMarkup(dT);
    if (elems && elems.length) {
      return elems;
    }

    console.warn("unable to retrieve any image in dropped data");
  };

  getImgSrc = (element: Element) => {
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

  getHTMLMarkup = (dT: DataTransfer) => {
    const markup = dT.getData("text/html");

    if (markup) {
      const doc = new DOMParser().parseFromString(markup, "text/html");
      const imgs = (doc && doc.querySelectorAll("img,image")) || [];
      return Array.prototype.map.call(imgs, this.getImgSrc);
    }
  };

  getFiles = (dT: DataTransfer) => {
    let srcs = [];
    let imgObj;

    if (dT.files && dT.files.length) {
      for (var i = 0; i < dT.files.length; i++) {
        if (dT.files[i].type.indexOf("image/") === 0) {
          imgObj = {
            type: "file",
            element: new Image(),
            file: dT.files[i],
          };
          const src = URL.createObjectURL(imgObj.file);
          srcs.push(src);
        }
      }
    }
    return srcs;
  };

  handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
    let srcs = this.retrieveData(e.dataTransfer);
    srcs?.forEach((src) => {
      let img = new Image();
      const rect = e.currentTarget.getBoundingClientRect();

      img.onload = () => {
        const size = { width: img.naturalWidth, height: img.naturalHeight };
        const position = {
          x: (e.clientX - rect.left) / this.props.zoom - size.width / 2,
          y: (e.clientY - rect.top) / this.props.zoom - size.height / 2,
        };
        const image: IImage = {
          src: src as string,
          divPosition: position,
          imgPosition: { x: 0, y: 0 },
          divSize: size,
          imgSize: size,
        };

        this.setState({ images: [...this.state.images, image] });
      };

      img.src = src as string;
    });
  };

  handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
  };

  reorderImages = (index: number) => {
    let images = [...this.state.images];
    const tempImage: IImage = images[index];
    images.splice(index, 1);
    images.push(tempImage);
    this.setState({ images });
  };

  updateImage = (index: number, image: IImage) => {
    let images = [...this.state.images];
    images[index] = image;
    this.setState({ images });
  };

  deleteImage = (index: number) => {
    let images = [...this.state.images];
    images.splice(index, 1);
    this.setState({ images });
  };

  render() {
    return (
      <div
        className="free-dropper"
        onDragOver={(e) => this.handleDragOver(e)}
        onDrop={(e) => this.handleDrop(e)}
        onDragLeave={(e) => this.handleDragLeave(e)}
      >
        {this.state.images.map((image, index) => (
          <DraggableImage
            image={image}
            key={index}
            index={index}
            reorderImages={this.reorderImages}
            updateImage={this.updateImage}
            deleteImage={this.deleteImage}
            disable={this.props.disable}
            zoom={this.props.zoom}
          />
        ))}
      </div>
    );
  }
}

export default FreeDropper;
