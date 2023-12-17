import { useState } from 'react';
import bishopImg from './chussy/pieces/bishop.png';
import pawnImg from './chussy/pieces/pawn.png';
import rookImg from './chussy/pieces/rook.png';
import knightImg from './chussy/pieces/knight.png';
import queenImg from './chussy/pieces/queen.png';
import kingImg from './chussy/pieces/king.png';
import './App.css';
import {
  // getChussBoard,
  newBoard,
  ChussPieceSide,
  ChussPieceType,
  possibleMoves,
  makeMove,
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
  const [gameState, setGameState] = useState(() => ({
    board: newBoard(),
    turn: 0,
  }));
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const legalMoves = selectedPosition
    ? possibleMoves(gameState.board, selectedPosition)
    : null;
  console.log(legalMoves);
  return (
    <div>
      {gameState.board.map((row, y) => (
        <div style={{ height: squareSize }}>
          {row.map((piece, x) => {
            const isLegalMove =
              selectedPosition &&
              legalMoves?.some((move) => move[0] === y && move[1] === x);
            const isSelectablePiece =
              piece &&
              ((piece.pieceSide === 'White' && gameState.turn % 2 == 0) ||
                (piece.pieceSide === 'Black' && gameState.turn % 2 == 1));
            return (
              <button
                style={{
                  padding: 0,
                  margin: 0,
                  filter: isLegalMove ? 'invert(1)' : undefined,
                }}
                disabled={!isLegalMove && !isSelectablePiece}
                onClick={() => {
                  if (isLegalMove) {
                    setSelectedPosition(null);
                    setGameState({
                      board: makeMove(gameState.board, selectedPosition, [
                        y,
                        x,
                      ]),
                      turn: gameState.turn + 1,
                    });
                  } else {
                    setSelectedPosition([y, x]);
                  }
                }}
              >
                <Square
                  y={y}
                  x={x}
                  side={piece?.pieceSide}
                  type={piece?.pieceType}
                />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default App;
