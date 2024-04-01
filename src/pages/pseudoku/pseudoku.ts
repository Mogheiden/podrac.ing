import { getSudoku } from 'sudoku-gen';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

export type SudokuBoard = (SudokuSquare | null)[][];

interface SudokuSquare {
  input: number | null;
  possibilities: number[];
}

export function newBoard(difficulty: Difficulty) {
  const newSudoku = getSudoku(difficulty);
  const newPuzzle = newSudoku.puzzle;
  const solution = newSudoku.solution;
  const board = [];
  for (let i = 0; i < 9; i++) {
    const line = [];
    for (let j = 0; j < 9; j++) {
      const currentChar = newPuzzle[i * 9 + j];
      if (currentChar === '-') {
        line.push(null);
      } else {
        const square: SudokuSquare = {
          input: parseInt(currentChar),
          possibilities: [],
        };
        line.push(square);
      }
    }
    board.push(line);
  }
  return { board, solution };
}

export function checkIncorrect(
  coord: [number, number] | null,
  board: SudokuBoard
) {
  if (coord == null) {
    throw new Error("something's gone badly wrong, bucko!");
  }
  const yCoord = coord[0];
  const xCoord = coord[1];
  const squareY = Math.floor(yCoord / 3);
  const squareX = Math.floor(xCoord / 3);
  const square = board[yCoord][xCoord];
  if (square == null) {
    throw new Error("something's gone badly wrong, bucko!");
  }
  const addedNumber = square.input;
  const errors: string[] = [];
  for (let i = 0; i < 9; i++) {
    const currentYCheck = board[yCoord][i]?.input;
    const currentXCheck = board[i][xCoord]?.input;
    if (addedNumber === currentYCheck && xCoord !== i) {
      errors.push(`${yCoord}-${i}`);
    }
    if (addedNumber === currentXCheck && yCoord !== i) {
      errors.push(`${i}-${xCoord}`);
    }
  }
  console.log(board);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const currentY = squareY * 3 + i;
      const currentX = squareX * 3 + j;
      const currentSquareCheck = board[currentY][currentX]?.input;
      console.log(currentY, currentX, currentSquareCheck);
      if (
        currentSquareCheck != null &&
        currentSquareCheck === addedNumber &&
        !(currentY === yCoord && currentX === xCoord)
      ) {
        errors.push(`${currentY}-${currentX}`);
      }
    }
  }
  return errors;
}

export function checkWin(board: SudokuBoard, solution: string) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const currentSquare = board[i][j];
      if (!currentSquare) {
        return false;
      }
      const index = i * 9 + j;
      if (currentSquare.input !== parseInt(solution[index])) {
        return false;
      }
    }
  }
  return true;
}

export function findRelatedSquares(coord: [number, number] | null) {
  if (coord == null) {
    return null;
  }
  const relatedSquares = new Set<string>();
  const yCoord = coord[0];
  const xCoord = coord[1];
  const squareY = Math.floor(yCoord / 3);
  const squareX = Math.floor(xCoord / 3);
  for (let i = 0; i < 9; i++) {
    relatedSquares.add(`${i}-${xCoord}`);
    relatedSquares.add(`${yCoord}-${i}`);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const currentY = squareY * 3 + i;
      const currentX = squareX * 3 + j;
      relatedSquares.add(`${currentY}-${currentX}`);
    }
  }
  console.log(yCoord, xCoord, relatedSquares);
  return relatedSquares;
}

export function setSquare(
  board: SudokuBoard,
  addedNumber: number | null,
  coord: [number, number] | null
) {
  if (!coord) {
    throw Error('oops!');
  }
  const yCoord = coord[0];
  const xCoord = coord[1];

  board = structuredClone(board);
  const newSquare: SudokuSquare = { input: addedNumber, possibilities: [] };
  board[yCoord][xCoord] = newSquare;
  return board;
}
