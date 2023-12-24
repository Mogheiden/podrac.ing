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
  turnPawnMovedTwoSpaces?: number;
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
  turnNumber: number,
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
    if (!piece.pieceMoved) {
      if (
        !board[row][col + 1] &&
        !board[row][col + 2] &&
        board[row][col + 3] &&
        !board[row][col + 3]!.pieceMoved &&
        !isInCheck(board, turnNumber, piece.pieceSide)
      ) {
        if (
          !isInCheck(
            testMove(board, [row, col], [row, col + 1]),
            turnNumber,
            piece.pieceSide
          )
        ) {
          moveArray.push([row, col + 2]);
        }
      }
      if (
        !board[row][col - 1] &&
        !board[row][col - 2] &&
        !board[row][col - 3] &&
        board[row][col - 4] &&
        !board[row][col - 4]!.pieceMoved &&
        !isInCheck(board, turnNumber, piece.pieceSide)
      ) {
        if (
          !isInCheck(
            testMove(board, [row, col], [row, col - 1]),
            turnNumber,
            piece.pieceSide
          )
        ) {
          moveArray.push([row, col - 2]);
        }
      }
    }
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
    [
      [row, col - 1],
      [row, col + 1],
    ].forEach((square) => {
      const enemypiece = board[square[0]][square[1]];
      if (
        enemypiece &&
        enemypiece.pieceSide !== piece.pieceSide &&
        enemypiece.pieceType === 'Pawn' &&
        enemypiece.turnPawnMovedTwoSpaces === turnNumber - 1
      ) {
        moveArray.push([square[0] + direction, square[1]]);
      }
    });
  }
  if (!checkChecks) {
    return moveArray;
  }
  return moveArray.filter((move) => {
    const testBoard = testMove(board, [row, col], move);
    return !isInCheck(testBoard, turnNumber, piece.pieceSide);
  });
}

export function isInCheck(
  board: ChussBoard,
  turn: number,
  side: ChussPieceSide
) {
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
        const array = possibleMoves(board, turn, [y, x], false);
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
  if (piece!.pieceType == 'King' && destiCol - oriCol === 2) {
    board[oriRow][oriCol] = null;
    board[destiRow][destiCol] = piece;
    board[oriRow][oriCol + 3] = null;
    board[destiRow][destiCol - 1] = {
      pieceType: 'Rook',
      pieceMoved: true,
      pieceSide: piece!.pieceSide,
    };
    return board;
  }
  if (piece!.pieceType == 'King' && destiCol - oriCol === -2) {
    board[oriRow][oriCol] = null;
    board[destiRow][destiCol] = piece;
    board[oriRow][oriCol - 4] = null;
    board[destiRow][destiCol + 1] = {
      pieceType: 'Rook',
      pieceMoved: true,
      pieceSide: piece!.pieceSide,
    };
    return board;
  }
  if (
    piece!.pieceType === 'Pawn' &&
    Math.abs(destiCol - oriCol) === 1 &&
    !board[destiRow][destiCol]
  ) {
    board[oriRow][destiCol] = null;
  }
  board[oriRow][oriCol] = null;
  board[destiRow][destiCol] = piece;

  return board;
}

export function makeMove(
  board: ChussBoard,
  turn: number,
  [oriRow, oriCol]: readonly [number, number],
  [destiRow, destiCol]: readonly [number, number]
) {
  const piece = board[oriRow][oriCol];
  if (!piece) {
    throw new Error("There's no piece there bucko!");
  }
  piece.pieceMoved = true;
  if (piece.pieceType === 'Pawn' && Math.abs(oriRow - destiRow) === 2) {
    piece.turnPawnMovedTwoSpaces = turn;
  }
  return testMove(board, [oriRow, oriCol], [destiRow, destiCol]);
}

export function hasLegalMoves(
  board: ChussBoard,
  turnNumber: number,
  side: ChussPieceSide
) {
  for (let y = 0; y < boardsize; y++) {
    for (let x = 0; x < boardsize; x++) {
      if (board[y][x] && board[y][x]?.pieceSide === side) {
        const array = possibleMoves(board, turnNumber, [y, x]);
        if (array.length !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}
