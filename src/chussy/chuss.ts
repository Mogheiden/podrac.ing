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
  const board = [
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
  [row, col]: [row: number, column: number],
  checkChecks: boolean = true
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
          currentCol >= boardsize ||
          currentRow >= boardsize
        ) {
          sentinel = false;
          break;
        }

        const thingAtPos = board[currentRow][currentCol];

        if (!thingAtPos) {
          moveArray.push([currentRow, currentCol]);
        } else if (thingAtPos.pieceSide != piece.pieceSide) {
          moveArray.push([currentRow, currentCol]);
          sentinel = false;
          break;
        } else {
          sentinel = false;
          break;
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
  if (!checkChecks) {
    return moveArray;
  }
  return moveArray.filter((move) => {
    const testBoard = testMove(board, [row, col], move);
    return !isInCheck(testBoard, piece.pieceSide);
  });
}

export function isInCheck(board: ChussBoard, side: ChussPieceSide) {
  const kingPos = (() => {
    for (let y = 0; y < boardsize; y++) {
      for (let x = 0; x < boardsize; x++) {
        if (
          board[y][x] &&
          board[y][x]?.pieceType === 'King' &&
          board[y][x]?.pieceSide === side
        ) {
          return [y, x] as const;
        }
      }
    }
    throw new Error("There's no king on this board bucko!");
  })();

  for (let y = 0; y < boardsize; y++) {
    for (let x = 0; x < boardsize; x++) {
      if (board[y][x] && board[y][x]?.pieceSide !== side) {
        const array = possibleMoves(board, [y, x], false);
        if (
          array.some(
            (tuple) => tuple[0] === kingPos[0] && tuple[1] === kingPos[1]
          )
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function testMove(
  board: ChussBoard,
  [oriRow, oriCol]: readonly [number, number],
  [destiRow, destiCol]: readonly [number, number]
): ChussBoard {
  board = board.map(function (arr) {
    return arr.slice();
  });
  const piece = board[oriRow][oriCol];
  board[oriRow][oriCol] = null;
  board[destiRow][destiCol] = piece;
  //   if (piece) {
  //     piece.pieceMoved = true;
  //   }
  return board;
}

export function makeMove(
  board: ChussBoard,
  [oriRow, oriCol]: readonly [number, number],
  [destiRow, destiCol]: readonly [number, number]
) {
  const piece = board[oriRow][oriCol];
  if (!piece) {
    throw new Error("There's no piece there bucko!");
  }
  piece.pieceMoved = true;
  return testMove(board, [oriRow, oriCol], [destiRow, destiCol]);
}
