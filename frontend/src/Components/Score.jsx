import { useEffect, useState } from "react";
import "./Score.css";

function Score() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch("/api/users/all")
      .then((res) => res.json())
      .then((data) => setScores(data));
  }, []);

  return (
    <div className="leaderboard">
      <h1 className="leaderboard-title">Top Ten</h1>
      {scores?.map((score, rank) => {
        return (
          <span key={rank}>
            {rank + 1 + ". " + score.username + " " + score.score}
          </span>
        );
      })}
    </div>
  );
}

export default Score;
