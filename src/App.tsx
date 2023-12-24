import { useEffect, useState } from 'react';
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
  isInCheck,
  hasLegalMoves,
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
  return (
    <div
      style={{
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
    ? possibleMoves(gameState.board, gameState.turn, selectedPosition)
    : null;
  // console.log(legalMoves);
  const turnSide = gameState.turn % 2 === 0 ? 'White' : 'Black';
  const inCheck = isInCheck(gameState.board, gameState.turn, turnSide);
  const hasAnyLegalMoves = hasLegalMoves(
    gameState.board,
    gameState.turn,
    turnSide
  );
  console.log(hasAnyLegalMoves);
  useEffect(() => {
    setTimeout(() => {
      if (inCheck) {
        if (!hasAnyLegalMoves) {
          alert(`${turnSide} has been checkmated.`);
          setGameState({ board: newBoard(), turn: 0 });
        } else {
          alert('Check!');
        }
      }
    }, 1);
  }, [hasAnyLegalMoves, inCheck, turnSide]);
  return (
    <div>
      {gameState.board.map((row, y) => (
        <div style={{ height: squareSize }}>
          {row.map((piece, x) => {
            const isLegalMove =
              selectedPosition &&
              legalMoves?.some((move) => move[0] === y && move[1] === x);
            const isSelectablePiece = piece && piece.pieceSide === turnSide;
            let backgroundColor = 'green';
            if ((y % 2 && x % 2) || (y % 2 == 0 && x % 2 == 0)) {
              backgroundColor = 'white';
            }
            return (
              <button
                style={{
                  padding: 0,
                  margin: 0,
                  boxShadow: isLegalMove
                    ? 'inset 0px -2px 0px 5px red'
                    : undefined,
                  backgroundColor,
                  borderRadius: 0,
                }}
                disabled={!isLegalMove && !isSelectablePiece}
                onClick={() => {
                  if (isLegalMove) {
                    setSelectedPosition(null);
                    setGameState({
                      board: makeMove(
                        gameState.board,
                        gameState.turn,
                        selectedPosition,
                        [y, x]
                      ),
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
      <br />
      <button onClick={() => setGameState({ board: newBoard(), turn: 0 })}>
        reset
      </button>
    </div>
  );
}

export default App;
