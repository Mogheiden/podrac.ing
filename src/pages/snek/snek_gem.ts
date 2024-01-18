interface SnekState {
  snek: [number, number][];
  digestingCrumbs: [number, number][];
  crumb: [number, number];
  direction: 'N' | 'S' | 'E' | 'W';
  score: number;
  gameOver: boolean;
}

const boardSize = 15;

export function newGame(): SnekState {
  return {
    snek: [
      [Math.floor(boardSize / 2), Math.floor(boardSize / 2)],
      [Math.floor(boardSize / 2), Math.floor(boardSize / 2) - 1],
    ],
    crumb: [7, 10],
    digestingCrumbs: [],
    direction: 'E',
    score: 0,
    gameOver: false,
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
    } else if (
      state.digestingCrumbs.some(
        (digestedCrumb) =>
          coord[0] === digestedCrumb[0] && coord[1] === digestedCrumb[1]
      )
    ) {
      str1d[stringIndex] = 'O';
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

export function changeDir(
  state: SnekState,
  dir: 'N' | 'S' | 'E' | 'W'
): SnekState {
  state = structuredClone(state);
  state.direction = dir;
  return state;
}

export function step(state: SnekState): SnekState {
  state = structuredClone(state);
  const snekHead = state.snek[0];
  let nextStep: [number, number];
  if (state.direction === 'N') {
    nextStep = [snekHead[0] - 1, snekHead[1]];
  } else if (state.direction === 'S') {
    nextStep = [snekHead[0] + 1, snekHead[1]];
  } else if (state.direction === 'E') {
    nextStep = [snekHead[0], snekHead[1] + 1];
  } else if (state.direction === 'W') {
    nextStep = [snekHead[0], snekHead[1] - 1];
  } else {
    throw new Error('Unrecognised direction bucko!');
  }

  if (
    nextStep[0] < 0 ||
    nextStep[0] === boardSize ||
    nextStep[1] < 0 ||
    nextStep[1] === boardSize
  ) {
    state.gameOver = true;
    return state;
  }

  if (
    state.snek.some(
      (snekCoord) =>
        snekCoord[0] === nextStep[0] && nextStep[1] === snekCoord[1]
    )
  ) {
    state.gameOver = true;
    return state;
  }

  function getCrumb() {
    const tentativeCrumb: [number, number] = [
      Math.floor(Math.random() * boardSize),
      Math.floor(Math.random() * boardSize),
    ];
    if (
      state.snek.some(
        (snekCoord) =>
          snekCoord[0] === tentativeCrumb[0] &&
          tentativeCrumb[1] === snekCoord[1]
      )
    ) {
      return getCrumb();
    }
    return tentativeCrumb;
  }

  if (nextStep[0] === state.crumb[0] && nextStep[1] === state.crumb[1]) {
    state.digestingCrumbs.push(state.crumb);
    state.score++;
    state.crumb = getCrumb();
  }

  state.snek.unshift(nextStep);
  if (
    state.digestingCrumbs.length > 0 &&
    state.digestingCrumbs[0][0] === state.snek[state.snek.length - 1][0] &&
    state.digestingCrumbs[0][1] === state.snek[state.snek.length - 1][1]
  ) {
    state.digestingCrumbs.shift();
    return state;
  }
  state.snek.pop();
  return state;
}
