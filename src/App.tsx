import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {
  getChussBoard,
  newBoard,
  ChussPieceSide,
  ChussPieceType,
} from './chussy/chuss';

const squareSize = 60;

function Square(props: {
  y: number;
  x: number;
  side?: ChussPieceSide;
  type?: ChussPieceType;
}) {
  let backgroundColor = 'brown';
  if ((props.y % 2 && props.x % 2) || (props.y % 2 == 0 && props.x % 2 == 0)) {
    backgroundColor = 'white';
  }
  return (
    <div
      style={{
        backgroundColor,
        height: squareSize,
        width: squareSize,
        display: 'inline-block',
      }}
    >
      {props.type}
    </div>
  );
}

//{row.map((piece) => <Square/>)}

function App() {
  const [board, setBoard] = useState(() => newBoard());
  return (
    <div>
      {board.map((row, y) => (
        <div style={{ height: squareSize }}>
          {row.map((piece, x) => (
            <Square
              y={y}
              x={x}
              side={piece?.pieceSide}
              type={piece?.pieceType}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
