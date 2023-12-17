export function getChussBoard() {
  return [];
}

const boardsize = 8;

export type ChussPieceType =
  | 'Pawn'
  | 'Knight'
  | 'Rook'
  | 'Bishop'
  | 'Queen'
  | 'King';

export type ChussPieceSide = 'Black' | 'White';

type ChussBoard = (ChussPiece | null)[][];

interface ChussPiece {
  pieceType: ChussPieceType;
  pieceSide: ChussPieceSide;
  pieceMoved: boolean;
}

function uPiece(
  pieceType: ChussPieceType,
  pieceSide: ChussPieceSide
): ChussPiece {
  return { pieceType, pieceSide, pieceMoved: false };
}

export function newBoard(): ChussBoard {
  let board = [
    [
      uPiece('Rook', 'Black'),
      uPiece('Knight', 'Black'),
      uPiece('Bishop', 'Black'),
      uPiece('Queen', 'Black'),
      uPiece('King', 'Black'),
      uPiece('Bishop', 'Black'),
      uPiece('Knight', 'Black'),
      uPiece('Rook', 'Black'),
    ],
    [
      uPiece('Pawn', 'Black'),
      uPiece('Pawn', 'Black'),
      uPiece('Pawn', 'Black'),
      uPiece('Pawn', 'Black'),
      uPiece('Pawn', 'Black'),
      uPiece('Pawn', 'Black'),
      uPiece('Pawn', 'Black'),
      uPiece('Pawn', 'Black'),
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      uPiece('Pawn', 'White'),
      uPiece('Pawn', 'White'),
      uPiece('Pawn', 'White'),
      uPiece('Pawn', 'White'),
      uPiece('Pawn', 'White'),
      uPiece('Pawn', 'White'),
      uPiece('Pawn', 'White'),
      uPiece('Pawn', 'White'),
    ],
    [
      uPiece('Rook', 'White'),
      uPiece('Knight', 'White'),
      uPiece('Bishop', 'White'),
      uPiece('Queen', 'White'),
      uPiece('King', 'White'),
      uPiece('Bishop', 'White'),
      uPiece('Knight', 'White'),
      uPiece('Rook', 'White'),
    ],
  ];

  return board;
}

export function possibleMoves(
  board: ChussBoard,
  [row, col]: [row: number, column: number]
): [row: number, column: number][] {
  const moveArray: [number, number][] = [];
  const piece = board[row][col];
  if (!piece) {
    throw new Error("There's no piece there bucko!");
  }

  const allowMovementInDirections = (
    directions: [number, number][],
    singleStep?: boolean
  ) => {
    directions.forEach(([dRow, dCol]) => {
      let currentRow = row;
      let currentCol = col;

      let sentinel = true;

      while (sentinel) {
        currentCol += dCol;
        currentRow += dRow;

        if (
          currentCol < 0 ||
          currentRow < 0 ||
          currentCol > boardsize ||
          currentRow > boardsize
        ) {
          sentinel = false;
        }

        const thingAtPos = board[currentRow][currentCol];

        if (!thingAtPos) {
          moveArray.push([currentRow, currentCol]);
        } else if (thingAtPos.pieceSide != piece.pieceSide) {
          moveArray.push([currentRow, currentCol]);
          sentinel = false;
        } else {
          sentinel = false;
        }

        if (singleStep) {
          sentinel = false;
        }
      }
    });
  };
  if (piece.pieceType === 'Rook') {
    allowMovementInDirections([
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]);
  } else if (piece.pieceType === 'Bishop') {
    allowMovementInDirections([
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]);
  } else if (piece.pieceType === 'Queen') {
    allowMovementInDirections([
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]);
  } else if (piece.pieceType === 'King') {
    allowMovementInDirections(
      [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ],
      true
    );
  } else if (piece.pieceType === 'Knight') {
    allowMovementInDirections(
      [
        [2, 1],
        [2, -1],
        [1, 2],
        [-1, 2],
        [-2, 1],
        [-2, -1],
        [-1, -2],
        [1, -2],
      ],
      true
    );
  } else if (piece.pieceType === 'Pawn') {
    const direction: number = piece.pieceSide == 'White' ? -1 : 1;
    if (!board[row + 1 * direction][col]) {
      moveArray.push([row + 1 * direction, col]);
      if (!piece.pieceMoved && !board[row + 2 * direction][col]) {
        moveArray.push([row + 2 * direction, col]);
      }
    }
    if (
      board[row + 1 * direction][col + 1] &&
      board[row + 1 * direction][col + 1]?.pieceSide !== piece.pieceSide
    ) {
      moveArray.push([row + 1 * direction, col + 1]);
    }
    if (
      board[row + 1 * direction][col - 1] &&
      board[row + 1 * direction][col - 1]?.pieceSide !== piece.pieceSide
    ) {
      moveArray.push([row + 1 * direction, col - 1]);
    }
  }
  return moveArray;
}