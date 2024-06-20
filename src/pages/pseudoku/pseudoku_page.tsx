import { useState } from 'react';
import {
  setSquare,
  findRelatedSquares,
  newBoard,
  checkIncorrect,
} from './pseudoku';

const squareSize = 50;

// function Square(props: {
//   y: number;
//   x: number;
//   input?: number;
//   possibilities?: number[];
// }) {
//   return props.input;
// }

export function PseudokuPage() {
  const [{ board }] = useState(() => newBoard('medium'));
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(
    null
  );
  const [incorrectSquares, setIncorrectSquares] = useState<string[]>([]);
  const [gameState, setGameState] = useState(board);
  const related = findRelatedSquares(selectedSquare) ?? new Set();
  return (
    <div>
      {gameState.map((row, y) => (
        <div style={{ height: squareSize, width: 800 }}>
          {row.map((square, x) => {
            const isRelated = related.has(`${y}-${x}`);
            const isError = incorrectSquares.includes(`${y}-${x}`);
            // console.log(isRelated);
            return (
              <button
                style={{
                  padding: 0,
                  margin: 0,
                  backgroundColor: isRelated ? 'gray' : 'white',
                  color: isError ? 'red' : 'black',
                  borderRadius: 0,
                  border: '1px solid black',
                  height: squareSize,
                  width: squareSize,
                }}
                disabled={board[y][x] != null || incorrectSquares.length > 0}
                onClick={() => {
                  setSelectedSquare([y, x]);
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                  }}
                >
                  {square?.input}
                </div>
              </button>
            );
          })}
        </div>
      ))}
      <br />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 3fr)',
          width: 156,
          gap: 2,
        }}
      >
        {new Array(9).fill(0).map((_, i) => (
          <button
            disabled={selectedSquare == null || incorrectSquares.length > 0}
            style={{
              height: 50,
              width: 50,
              border: '1px solid black',
              borderRadius: 5,
            }}
            onClick={() => {
              // console.log(gameState);
              const updatedBoard = setSquare(gameState, i + 1, selectedSquare);
              setGameState(updatedBoard);
              const incorrectSquares = checkIncorrect(
                selectedSquare,
                updatedBoard
              );
              setIncorrectSquares(incorrectSquares);
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        disabled={selectedSquare == null}
        style={{
          height: 50,
          width: 50,
          border: '1px solid black',
          borderRadius: 5,
        }}
        onClick={() => {
          // console.log(gameState);
          const updatedBoard = setSquare(gameState, null, selectedSquare);
          // console.log(updatedBoard);
          setGameState(updatedBoard);
          const incorrectSquares = checkIncorrect(selectedSquare, updatedBoard);
          setIncorrectSquares(incorrectSquares);
        }}
      >
        clear
      </button>
    </div>
  );
}
