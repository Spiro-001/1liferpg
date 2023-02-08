import GameScreenCanvas from "./GameScreen/GameScreenCanvas";
import "./Screen.css";

function Screen() {
  return (
    <div className="screen">
      <GameScreenCanvas height={648} width={1152} />
    </div>
  );
}

export default Screen;
