import { boundaryCheckX } from "./Boundary";

export async function moveX(
  key,
  context,
  moveAnim,
  currentInputs,
  posX,
  posY,
  objectPos,
  boxSize,
  boxColor
) {
  moveAnim = true;
  while (currentInputs.current[key] !== 0) {
    if (
      boundaryCheckX(
        posX,
        posY,
        currentInputs.current[key] * 2,
        objectPos,
        boxSize,
        posX
      )
    ) {
    } else {
      for (let i = 0; i < Math.abs(currentInputs.current[key]); i++) {
        posX +=
          i *
          (currentInputs.current[key] / Math.abs(currentInputs.current[key]));
      }
    }

    context.fillStyle = "#000000";
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = boxColor;
    context.fillRect(posX, context.canvas.height - posY, boxSize, -boxSize);
    await new Promise((res) => setTimeout(res, 5));
  }
  moveAnim = false;
}
