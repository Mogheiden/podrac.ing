import { useEffect, useState } from 'react';
import bishopImg from './chussy/pieces/bishop.png';
import pawnImg from './chussy/pieces/pawn.png';
import rookImg from './chussy/pieces/rook.png';
import knightImg from './chussy/pieces/knight.png';
import queenImg from './chussy/pieces/queen.png';
import kingImg from './chussy/pieces/king.png';
import insufficientmaterials from './chussy/pieces/insufficientmaterials.jpeg';
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
  isDrawByMaterial,
  promoteAndMakeMove,
  isPawnPromotion,
  ChussBoard,
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

type ModalType =
  | 'check'
  | 'checkmate'
  | 'promotion'
  | 'stalemate'
  | 'draw'
  | 'promotion';

//{row.map((piece) => <Square/>)}

function App() {
  const [gameState, setGameState] = useState(() => ({
    board: newBoard(),
    turn: 0,
  }));
  const [gameHistory, setGameHistory] = useState(() => ({
    undoStack: [] as { board: ChussBoard; turn: number }[],
  }));
  const [selectedPiecePos, setSelectedPiecePos] = useState<
    [number, number] | null
  >(null);
  const [pawnPromotionDest, setPawnPromotionDest] = useState<
    [number, number] | null
  >(null);
  const [_modalState, setModal] = useState<ModalType | null>(null);
  let modal = _modalState;
  //const [isCheckmateModalOpen, setCheckmateModalOpen] = useState(false);
  const legalMoves = selectedPiecePos
    ? possibleMoves(gameState.board, gameState.turn, selectedPiecePos)
    : null;
  // console.log(legalMoves);
  const turnSide = gameState.turn % 2 === 0 ? 'White' : 'Black';
  const inCheck = isInCheck(gameState.board, gameState.turn, turnSide);
  const drawByMaterial = isDrawByMaterial(gameState.board);
  const hasAnyLegalMoves = hasLegalMoves(
    gameState.board,
    gameState.turn,
    turnSide
  );
  useEffect(() => {
    if (inCheck) {
      if (!hasAnyLegalMoves) {
        setModal('checkmate');
      } else {
        setModal('check');
      }
    } else if (!hasAnyLegalMoves) {
      setModal('stalemate');
    } else if (drawByMaterial) {
      setModal('draw');
    }
  }, [hasAnyLegalMoves, inCheck, turnSide, drawByMaterial]);
  if (pawnPromotionDest) {
    modal = 'promotion';
  }

  function renderModalContent(modal: ModalType) {
    switch (modal) {
      case 'check':
        return (
          <>
            <div style={{ color: 'white', fontSize: '24px' }}>Check!</div>
            <br />
            <button onClick={() => setModal(null)}>okay!</button>
          </>
        );
      case 'checkmate':
        return (
          <>
            <div style={{ color: 'white', fontSize: '24px' }}>
              {turnSide} has been checkmated.
            </div>
            <br />
            <button
              onClick={() => {
                setGameState({ board: newBoard(), turn: 0 });
                setGameHistory({ undoStack: [] });
                setModal(null);
              }}
            >
              Rematch
            </button>
          </>
        );
      case 'stalemate':
        return (
          <>
            <div style={{ color: 'white', fontSize: '24px' }}>Stalemate</div>
            <br />
            <button
              onClick={() => {
                setGameState({ board: newBoard(), turn: 0 });
                setGameHistory({ undoStack: [] });
                setModal(null);
              }}
            >
              Rematch
            </button>
          </>
        );
      case 'draw':
        return (
          <>
            <div>
              <img src={insufficientmaterials} />
            </div>
            <br />
            <button
              onClick={() => {
                setGameState({ board: newBoard(), turn: 0 });
                setGameHistory({ undoStack: [] });
                setModal(null);
              }}
            >
              Rematch
            </button>
          </>
        );
      case 'promotion':
        if (!pawnPromotionDest || !selectedPiecePos) {
          throw new Error(
            'Expected pawn promotion destination and origin BUCKO!'
          );
        }
        return (
          <>
            <div style={{ color: 'white', fontSize: '24px' }}>
              Choose promotion type:
            </div>
            <br />
            {(['Queen', 'Rook', 'Knight', 'Bishop'] as const).map((piece) => (
              <button
                onClick={() => {
                  setGameHistory({
                    undoStack: gameHistory.undoStack.concat(
                      structuredClone(gameState)
                    ),
                  });
                  setGameState({
                    board: promoteAndMakeMove(
                      gameState.board,
                      gameState.turn,
                      selectedPiecePos,
                      pawnPromotionDest,
                      piece
                    ),
                    turn: gameState.turn + 1,
                  });
                  setSelectedPiecePos(null);
                  setPawnPromotionDest(null);
                  setModal(null);
                }}
              >
                <img
                  src={getChussPieceImage(piece)}
                  style={{
                    width: '5%',
                    height: '5%',
                    filter: turnSide === 'Black' ? 'invert(1)' : undefined,
                  }}
                />
              </button>
            ))}
          </>
        );
    }
    throw new Error('Invalid modal state');
  }

  return (
    <div>
      {gameState.board.map((row, y) => (
        <div style={{ height: squareSize }}>
          {row.map((piece, x) => {
            const isLegalMove =
              selectedPiecePos &&
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
                    if (
                      isPawnPromotion(gameState.board, selectedPiecePos, [y, x])
                    ) {
                      setPawnPromotionDest([y, x]);
                    } else {
                      setSelectedPiecePos(null);
                      setGameHistory({
                        undoStack: gameHistory.undoStack.concat(
                          structuredClone(gameState)
                        ),
                      });
                      setGameState({
                        board: makeMove(
                          gameState.board,
                          gameState.turn,
                          selectedPiecePos,
                          [y, x]
                        ),
                        turn: gameState.turn + 1,
                      });
                    }
                  } else {
                    setSelectedPiecePos([y, x]);
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
      <button
        onClick={() => {
          const state = gameHistory.undoStack.at(-1);
          if (!state) {
            alert(`You're at the start, bucko!`);
            return;
          } else {
            setGameState(state);
            setGameHistory({ undoStack: gameHistory.undoStack.slice(0, -1) });
            setSelectedPiecePos(null);
          }
        }}
      >
        undo
      </button>
      {modal ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000BB',
          }}
        >
          <div>{renderModalContent(modal)}</div>
        </div>
      ) : undefined}
    </div>
  );
}

export default App;
