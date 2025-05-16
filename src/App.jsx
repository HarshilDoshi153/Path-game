import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const gridSize = 25;
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [guessedCells, setGuessedCells] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  function incrementRow(path, row, col, rowInc, matrixSize) {
    for (let i = 1; i <= rowInc; i++) {
      row++;
      path.push([row, col]);
      if (row === matrixSize - 1) {
        return [path, row];
      }
    }
    return [path, row];
  }

  function stepsInDirection(path, row, col, steps, direction) {
    for (let j = 1; j <= steps; j++) {
      col += direction === "r" ? 1 : -1;
      path.push([row, col]);
    }
    return [path, col];
  }

  function generate(matrixSize) {
    let col = Math.floor(Math.random() * matrixSize);
    let row = -1;
    let rowInc = 2;
    let directionOptions = ["l", "r"];
    let path = [];

    while (row <= matrixSize - 1) {
      let direction =
        directionOptions[Math.floor(Math.random() * directionOptions.length)];

      let steps =
        direction === "l"
          ? Math.floor(Math.random() * (col + 1))
          : Math.floor(Math.random() * (matrixSize - col));

      [path, row] = incrementRow(path, row, col, rowInc, matrixSize);
      if (row === matrixSize - 1) break;

      [path, col] = stepsInDirection(path, row, col, steps, direction);
    }

    return path;
  }

  function CountdownTimer({ onComplete }) {
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
      if (timeLeft === 0) {
        if (onComplete) onComplete();
        return;
      }

      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

      return () => clearTimeout(timer);
    }, [timeLeft, onComplete]);

    return <div className="seconds">Seconds left: {timeLeft}</div>;
  }

  function startGame() {
    setShowGrid(true);
    setShowPath(true);
    setGameOver(false);
    setGuessedCells([]);
    setCurrentStep(0);

    const newHighlightedCells = generate(gridSize);
    setHighlightedCells(newHighlightedCells);
  }

  function handleCellClick(row, col) {
    if (!showGrid || showPath || gameOver) return;

    const correctCell = highlightedCells[currentStep];

    if (correctCell[0] === row && correctCell[1] === col) {
      setGuessedCells([...guessedCells, [row, col]]);
      setCurrentStep(currentStep + 1);

      if (currentStep + 1 === highlightedCells.length) {
        { <p className="game-over">Incorrect path</p> }
        setShowGrid(false);
      }
    } else {
      setGameOver(true);
      setShowGrid(false);
    }
  }

  return (
    <div className="container">
      <div className="heading">
        <h2>Guess the Path!!</h2>
        <div className="rules">
          <h5>
            The path is visible for 10 seconds. Remember it and click in the correct order (Top to bottom).
            {showGrid && showPath && (
              <CountdownTimer onComplete={() => setShowPath(false)} />
            )}
          </h5>
        </div>
      </div>

      {gameOver ? (
        <p className="game-over">Incorrect path</p>
      ) : currentStep === highlightedCells.length && highlightedCells.length > 0 ? (
        <p className="game-win">You win!!</p>
      ) : null}

      {showGrid && !gameOver && (
        <div className="grid-container">
          {[...Array(gridSize)].map((_, row) =>
            [...Array(gridSize)].map((_, col) => {
              const isPath = highlightedCells.some(([r, c]) => r === row && c === col);
              const isGuessed = guessedCells.some(([r, c]) => r === row && c === col);

              return (
                <div
                  key={`${row}-${col}`}
                  onClick={() => handleCellClick(row, col)}
                  className={`cell ${showPath && isPath ? "highlight" : isGuessed ? "correct" : ""}`}
                ></div>
              );
            })
          )}
        </div>
      )}

      <div className="mc-button full">
        <div className="title" onClick={startGame}>
          {gameOver || !showGrid ? "Start" : "Reset"}
        </div>
      </div>
    </div>
  );
}

export default App;
