export interface ICoords {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IImage {
  src: string;
  divPosition: ICoords;
  imgPosition: ICoords;
  divSize: ISize;
  imgSize: ISize;
}

interface IBoard {
  id: string;
  name: string;
  images: IImage[];
  position: ICoords;
  size: ISize;
  zoom: number;
}

export enum Position {
  Left,
  Top,
  Right,
  Bottom,
}

interface ISettings {
  defaultSize: ISize;
  gridEnabled: boolean;
  navPosition: Position;
}

interface ISydraft {
  boards: IBoard[];
  gallery: IImage[];
  settings: ISettings;
}
