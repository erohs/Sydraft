export interface ICoords {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IImgSize {
  width: number;
  height: number;
}

export interface IImage {
  src: string;
  divPosition: ICoords;
  imgPosition: ICoords;
  divSize: ISize;
  imgSize: IImgSize;
}
