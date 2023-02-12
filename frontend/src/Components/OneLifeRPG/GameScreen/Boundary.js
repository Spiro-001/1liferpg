export function boundaryCheckX(
  x,
  y,
  nextMoveX = 0,
  objectPos = [],
  boxSize,
  posX
) {
  for (const object of objectPos) {
    if (
      object.block[0] <= x + nextMoveX + boxSize &&
      object.block[2] >= x + nextMoveX &&
      object.block[1] < y + boxSize &&
      object.block[3] > y
    ) {
      if (object.block[2] >= x + nextMoveX && object.block[2] - 10 <= x) {
        posX = object.block[2] + 5;
      } else if (
        object.block[0] <= x + nextMoveX + boxSize &&
        object.block[0] - 50 >= x
      ) {
        posX = object.block[0] + boxSize - 50;
      }
      return true;
    }
  }
  return false;
}
