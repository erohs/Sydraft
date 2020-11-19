import { ICoords } from "../../../types";

export interface IBoardState {
  zoom: number;
  position: ICoords;
  offset: ICoords;
  isInteracting: boolean;
}
