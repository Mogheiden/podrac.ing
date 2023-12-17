export function getChussBoard() {
  return [];
}

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
