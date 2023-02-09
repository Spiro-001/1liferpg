import "./App.css";
import Score from "./Components/Score";
import Screen from "./Components/OneLifeRPG/Screen";

function App() {
  return (
    <div className="App">
      <h1 id="game-title">
        <span id="red">1</span>
        Life
      </h1>
      <div className="main">
        <Screen />
        <Score />
      </div>
    </div>
  );
}

export default App;
