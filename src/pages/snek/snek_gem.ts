interface SnekState {
  snek: [number, number][];
  crumb: [number, number];
  direction: 'N' | 'S' | 'E' | 'W';
  score: number;
}

const boardSize = 15;

export function newGame(): SnekState {
  return {
    snek: [[Math.floor(boardSize / 2), Math.floor(boardSize / 2)]],
    crumb: [5, 5],
    direction: 'E',
    score: 0,
  };
}

export function printBoard(state: SnekState) {
  const str1d = Array(boardSize * boardSize).fill('.');

  state.snek.forEach((coord, i) => {
    const stringIndex = coord[0] * boardSize + (coord[1] % boardSize);
    if (i === 0) {
      if (state.direction === 'N') {
        str1d[stringIndex] = '^';
      } else if (state.direction === 'E') {
        str1d[stringIndex] = '>';
      } else if (state.direction === 'S') {
        str1d[stringIndex] = 'V';
      } else if (state.direction === 'W') {
        str1d[stringIndex] = '<';
      }
    } else if (state.snek.length > 1 && i === state.snek.length - 1) {
      str1d[stringIndex] = '8';
    } else {
      str1d[stringIndex] = '#';
    }
  });
  str1d[state.crumb[0] * boardSize + (state.crumb[1] % boardSize)] = '*';

  let str = '';
  str1d.forEach((c, i) => {
    str += c;
    if ((i + 1) % boardSize === 0) {
      str += '\n';
    }
  });
  return str;
}
