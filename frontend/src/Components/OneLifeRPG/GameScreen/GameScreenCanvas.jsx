import { KeyboardInput } from "../Controller";

import "./Level.css";
import useKeypress from "react-use-keypress";

const { useRef, useEffect, useState } = require("react");

const GameScreenCanvas = (props) => {
  const [updateKey, setUpdateKey] = useState(false);
  const currentScore = useRef(0);
  const gameScreenCanvasRef = useRef(null);
  const levelRef = useRef(null);
  const enemyRef = useRef(null);
  const scoreRef = useRef(null);
  const debug = useRef(null);

  const hitIndicator = useRef(0);

  const currentInputs = useRef({ w: 0, s: 0, a: 0, d: 0 });

  const attackAnim = new Image();

  let posX = 500;
  let posY = 500;
  let floor = 0;

  let boxColor = "#FFFFFF";

  let boxSize = 20;

  let moveAnim = false;
  let jumpStrength = 20;

  let attackOneInit = false;

  const isOnFloor = useRef(true);

  let objectPos = []; // {objOne: [x, y, xmax, ymax]}

  const scoreUpdater = (context, multipler = 1.0, flat = 0, extra = 0) => {
    currentScore.current += 5 * multipler + flat + extra;
    context.clearRect(context.canvas.width - 200, 0, context.canvas.width, 50);
    context.font = "48px Pixelboy";
    context.fillStyle = "#FFFFFF";
    context.fillText(
      `${currentScore.current.toLocaleString()}`,
      context.canvas.width - (60 + currentScore.current.toString().length * 20),
      45
    );
  };

  const boundaryCheckX = (x, y, nextMoveX = 0) => {
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
  };

  const boundaryCheckY = (x, y, nextMoveY = posY) => {
    // console.log(posY);
    // console.log(isOnFloor.current);
    if (posY <= floor) {
      posY = floor;
      isOnFloor.current = true;
    }
    for (const object of objectPos) {
      if (
        object.block[0] <= x + boxSize &&
        object.block[2] >= x &&
        object.block[1] <= nextMoveY + boxSize &&
        object.block[3] >= nextMoveY
      ) {
        if (object.block[3] >= nextMoveY && object.block[3] - 10 <= y) {
          posY = object.block[3] + 5;
          isOnFloor.current = true;
        } else if (object.block[1] <= nextMoveY + boxSize - object.block[1]) {
          posY = object.block[1] - boxSize - 5;
          isOnFloor.current = false;
        }
        return true;
      }
    }
    return false;
  };

  const moveX = async (key, context) => {
    moveAnim = true;
    while (currentInputs.current[key] !== 0) {
      if (boundaryCheckX(posX, posY, currentInputs.current[key] * 2)) {
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
  };

  const jump = async (context) => {
    let startHeight = posY;
    let finish = startHeight === 0 ? 0 : 1;
    let x = 0;
    while (finish < 2) {
      isOnFloor.current = false;
      if (
        boundaryCheckY(
          posX,
          posY,
          -0.5 * Math.pow(x, 2) + jumpStrength * x + startHeight
        )
      ) {
        finish = 2;
      } else {
        posY = -0.5 * Math.pow(x, 2) + jumpStrength * x + startHeight;
      }
      if (posY <= 0) finish++;
      x++;
      context.fillStyle = "#000000";
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.fillStyle = boxColor;
      context.fillRect(posX, context.canvas.height - posY, boxSize, -boxSize);
      await new Promise((res) => setTimeout(res, 10));
    }
    posY = posY < 0 ? 0 : posY;
    context.fillStyle = boxColor;
    context.fillRect(posX, context.canvas.height - posY, boxSize, -boxSize);
    return x;
  };

  const attackOne = async (context, angle, xaxis, yaxis) => {
    attackOneInit = true;
    for (let i = 0; i < context.canvas.width; i += 20) {
      if (
        posX >= 0 &&
        posX <= i + 20 &&
        posY >= yaxis - 20 &&
        posY <= yaxis + 20
      )
        hitIndicator.current = 1;
      else hitIndicator.current = 0;
      context.fillStyle = "#FF0000";
      context.fillRect(i, context.canvas.height - yaxis - 20, 20, 10);
      await new Promise((res) => setTimeout(res, 5));
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    attackOneInit = false;
  };

  useKeypress(["a", "d"], async (event) => {
    currentInputs.current[event.key] = KeyboardInput(event.keyCode, 5);
  });

  useKeypress(["w"], async (event) => {
    const gameScreenCanvas = gameScreenCanvasRef.current;
    const context = gameScreenCanvas.getContext("2d");
    currentInputs.current[event.key] = KeyboardInput(event.keyCode);
    if (isOnFloor.current) jump(context);
  });

  useKeypress(" ", async (event) => {
    const gameScreenCanvas = gameScreenCanvasRef.current;
    const context = gameScreenCanvas.getContext("2d");
  });

  const updateTick = async () => {
    const gameScreenCanvas = gameScreenCanvasRef.current;
    const context = gameScreenCanvas.getContext("2d");

    const enemyScreenCanvas = enemyRef.current;
    const enemyContext = enemyScreenCanvas.getContext("2d");

    const scoreCanvas = scoreRef.current;
    const scoreContext = scoreCanvas.getContext("2d");

    const debugCanvas = debug.current;
    const debugContext = debugCanvas.getContext("2d");

    if (hitIndicator.current === 0) {
      debugContext.clearRect(
        0,
        0,
        debugContext.canvas.width,
        debugContext.canvas.height
      );
      debugContext.font = "72px Pixelboy";
      debugContext.fillStyle = "#FFFFFF";
      debugContext.fillText("Not Hit", 50, 50);
    } else {
      debugContext.clearRect(
        0,
        0,
        debugContext.canvas.width,
        debugContext.canvas.height
      );
      debugContext.font = "72px Pixelboy";
      debugContext.fillStyle = "#FFFFFF";
      debugContext.fillText("Hit", 50, 50);
    }

    if (!attackOneInit) attackOne(enemyContext, 0, posX, posY);
    scoreUpdater(scoreContext);

    if (!boundaryCheckY(posX, posY, posY - 5)) {
      if (posY < 0) posY = 0;
      context.fillStyle = "#000000";
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.fillStyle = boxColor;
      context.fillRect(posX, context.canvas.height - posY, boxSize, -boxSize);
      if (posY !== floor) posY -= 5;
    }

    if (currentInputs.current["a"] !== 0 && currentInputs.current["d"] === 0) {
      if (!moveAnim) moveX("a", context);
    } else if (
      currentInputs.current["d"] !== 0 &&
      currentInputs.current["a"] === 0
    ) {
      if (!moveAnim) moveX("d", context);
    } else {
    }
    setTimeout(updateTick, 1);
  };

  useEffect(() => {
    const gameScreenCanvas = gameScreenCanvasRef.current;
    const levelScreenCanvas = levelRef.current;
    const enemyScreenCanvas = enemyRef.current;
    const debugCanvas = debug.current;
    const context = gameScreenCanvas.getContext("2d");
    const levelContext = levelScreenCanvas.getContext("2d");
    const enemyContext = enemyScreenCanvas.getContext("2d");
    const debugContext = debugCanvas.getContext("2d");

    context.fillStyle = "#000000";
    context.fillRect(0, 0, 0, 0);

    levelContext.fillStyle = "#000000";
    levelContext.fillRect(
      context.canvas.width,
      context.canvas.height,
      -200,
      -100
    );

    levelContext.fillRect(0, context.canvas.height - 200, 200, 100);
    levelContext.fillRect(400, context.canvas.height, 200, -100);

    objectPos.push({
      block: [0, 0, 1, context.canvas.height],
    });

    objectPos.push({
      block: [
        context.canvas.width - 1,
        0,
        context.canvas.width,
        context.canvas.height,
      ],
    });

    objectPos.push({
      block: [0, 100, 200, 200],
    });

    objectPos.push({
      block: [400, 0, 600, 100],
    });

    objectPos.push({
      block: [context.canvas.width - 200, 0, context.canvas.width, 100],
    });

    document.addEventListener("keyup", (event) => {
      currentInputs.current[event.key] = 0;
    });

    updateTick();
  }, []);

  return (
    <>
      <canvas ref={debug} id="debug" />
      <canvas ref={scoreRef} id="score" />
      <canvas ref={enemyRef} {...props} id="enemy" />
      <canvas ref={levelRef} {...props} id="level" />
      <canvas ref={gameScreenCanvasRef} {...props} />
    </>
  );
};

export default GameScreenCanvas;
