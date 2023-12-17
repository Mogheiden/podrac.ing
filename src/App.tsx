import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import bishopImg from './chussy/pieces/bishop.png';
import pawnImg from './chussy/pieces/pawn.png';
import rookImg from './chussy/pieces/rook.png';
import knightImg from './chussy/pieces/knight.png';
import queenImg from './chussy/pieces/queen.png';
import kingImg from './chussy/pieces/king.png';
import './App.css';
import {
  getChussBoard,
  newBoard,
  ChussPieceSide,
  ChussPieceType,
} from './chussy/chuss';

const squareSize = 75;

function getChussPieceImage(type: ChussPieceType) {
  switch (type) {
    case 'Pawn':
      return pawnImg;
    case 'Knight':
      return knightImg;
    case 'Rook':
      return rookImg;
    case 'Bishop':
      return bishopImg;
    case 'Queen':
      return queenImg;
    case 'King':
      return kingImg;
  }
}

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
      {props.type && (
        <img
          src={getChussPieceImage(props.type)}
          style={{
            width: '100%',
            height: '100%',
            filter: props.side === 'Black' ? 'invert(1)' : undefined,
          }}
        />
      )}
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
