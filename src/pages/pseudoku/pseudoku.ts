import { getSudoku } from 'sudoku-gen';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';

export type SudokuBoard = (SudokuSquare | null)[][];

interface SudokuSquare {
  input: number;
  possibilities: number[];
}

export function newBoard(difficulty: Difficulty) {
  const newSudoku = getSudoku(difficulty);
  const newPuzzle = newSudoku.puzzle;
  const newSolution = newSudoku.solution;
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
  return { board, newSolution };
}

export function checkIncorrect(
  yCoord: number,
  xCoord: number,
  board: SudokuBoard
) {
  const squareY = Math.floor(yCoord / 3);
  const squareX = Math.floor(xCoord / 3);
  const square = board[yCoord][xCoord];
  if (square == null) {
    throw new Error("something's gone badly wrong, bucko!");
  }
  const addedNumber = square.input;
  const errors: [number, number][] = [];
  for (let i = 0; i < 9; i++) {
    const currentYCheck = board[yCoord][i]?.input;
    const currentXCheck = board[i][xCoord]?.input;
    if (addedNumber === currentYCheck && xCoord !== i) {
      errors.push([i, xCoord]);
    }
    if (addedNumber === currentXCheck && yCoord !== i) {
      errors.push([yCoord, i]);
    }
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const currentY = squareY * 3 + i;
      const currentX = squareX * 3 + j;
      const currentSquareCheck = board[squareY][squareX]?.input;
      if (
        currentSquareCheck === addedNumber &&
        currentY !== yCoord &&
        currentX !== xCoord
      ) {
        errors.push([currentY, currentX]);
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

export function addNumber(
  board: SudokuBoard,
  addedNumber: number,
  yCoord: number,
  xCoord: number
) {
  board = structuredClone(board);
  const newSquare: SudokuSquare = { input: addedNumber, possibilities: [] };
  board[yCoord][xCoord] = newSquare;
  return board;
}
