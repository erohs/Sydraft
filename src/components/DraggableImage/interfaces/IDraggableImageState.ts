import { ICoords } from "../../../types";

export interface IDraggableImageState {
  canDrag: boolean;
  offset: ICoords;
  button: number;
}
