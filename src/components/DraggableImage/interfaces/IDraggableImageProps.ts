import { IImage } from "../../../types";

export interface IDraggableImageProps {
  image: IImage;
  index: number;
  className?: string;
  reorderImages: (index: number) => void;
  updateImage: (index: number, image: IImage) => void;
  deleteImage: (index: number) => void;
}
