import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
function convertToMatrix(squares) {
  const matrix = [];
  for (let i = 0; i < 3; i++) {
    matrix.push(squares.slice(i * 3, (i + 1) * 3));
  }
  return matrix;
}

function nearwin(board, player) {
  // Check rows
  for (let i = 0; i < 3; ++i) {
    if (
      board[i][0] === player &&
      board[i][1] === player &&
      board[i][2] === null
    ) {
      return [i, 2];
    } else if (
      board[i][0] === player &&
      board[i][2] === player &&
      board[i][1] === null
    ) {
      return [i, 1];
    } else if (
      board[i][2] === player &&
      board[i][1] === player &&
      board[i][0] === null
    ) {
      return [i, 0];
    }
  }

  // Check columns
  for (let j = 0; j < 3; ++j) {
    if (
      board[0][j] === player &&
      board[1][j] === player &&
      board[2][j] === null
    ) {
      return [2, j];
    } else if (
      board[0][j] === player &&
      board[2][j] === player &&
      board[1][j] === null
    ) {
      return [1, j];
    } else if (
      board[2][j] === player &&
      board[1][j] === player &&
      board[0][j] === null
    ) {
      return [0, j];
    }
  }

  // Check diagonals
  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === null
  ) {
    return [2, 2];
  } else if (
    board[0][0] === player &&
    board[2][2] === player &&
    board[1][1] === null
  ) {
    return [1, 1];
  } else if (
    board[2][2] === player &&
    board[1][1] === player &&
    board[0][0] === null
  ) {
    return [0, 0];
  }

  if (
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === null
  ) {
    return [2, 0];
  } else if (
    board[1][1] === player &&
    board[2][0] === player &&
    board[0][2] === null
  ) {
    return [0, 2];
  } else if (
    board[0][2] === player &&
    board[2][0] === player &&
    board[1][1] === null
  ) {
    return [1, 1];
  }

  // No near win found
  return [-1, -1];
}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = "X"; // Assume X's move first

    const winner = calculateWinner(nextSquares);
    if (winner) {
      // X wins
      // TODO: Handle game end and declare X as the winner
      return;
    }

    let nextMoveRow = -1;
    let nextMoveCol = -1;
    [nextMoveRow, nextMoveCol] = nearwin(convertToMatrix(nextSquares), "X"); // Check for near win for X

    if (nextMoveRow !== -1 && nextMoveCol !== -1) {
      nextSquares[nextMoveRow * 3 + nextMoveCol] = "O"; // Move O to the near win position for X
    } else {
      nextMoveRow = -1;
      nextMoveCol = -1;
      [nextMoveRow, nextMoveCol] = nearwin(convertToMatrix(nextSquares), "O"); // Check for near win for O

      if (nextMoveRow !== -1 && nextMoveCol !== -1) {
        nextSquares[nextMoveRow * 3 + nextMoveCol] = "O"; // Move O to the near win position for O
      } else {
        // Perform other strategies if no near win found
        // Check if the center square is empty
        if (nextSquares[4] === null) {
          nextSquares[4] = "O"; // Move O to the center square
        } else {
          // Find an empty corner square
          const corners = [0, 2, 6, 8];
          const emptyCorners = corners.filter(
            (corner) => nextSquares[corner] === null
          );
          if (emptyCorners.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCorners.length);
            const cornerIndex = emptyCorners[randomIndex];
            nextSquares[cornerIndex] = "O"; // Move O to a random empty corner square
          } else {
            // No more empty squares
            // TODO: Handle game end and declare a tie
            return;
          }
        }
      }
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
