import { ISize } from "../types";

export const getBounds = (zoom: number) => {
  const client = document.documentElement;

  const top = -5000 + 5000 * zoom;
  const right = -5000 + client.clientWidth - 5000 * zoom;
  const bottom = -5000 + client.clientHeight - 5000 * zoom;
  const left = -5000 + 5000 * zoom;

  return [top, right, bottom, left];
};

export const checkCoords = (x: number, y: number, zoom: number) => {
  const [topBounds, rightBounds, bottomBounds, leftBounds] = getBounds(zoom);

  if (x > leftBounds) x = leftBounds;
  if (y > topBounds) y = topBounds;
  if (x < rightBounds) x = rightBounds;
  if (y < bottomBounds) y = bottomBounds;

  return [x, y];
};

export const getImageBounds = (size: ISize) => {
  const top = 0;
  const right = 10000 - size.width;
  const bottom = 10000 - size.height;
  const left = 0;

  return [top, right, bottom, left];
};

export const checkImageCoords = (x: number, y: number, size: ISize) => {
  const [topBounds, rightBounds, bottomBounds, leftBounds] = getImageBounds(size);

  if (x < leftBounds) x = leftBounds;
  if (y < topBounds) y = topBounds;
  if (x > rightBounds) x = rightBounds;
  if (y > bottomBounds) y = bottomBounds;

  return [x, y];
};
