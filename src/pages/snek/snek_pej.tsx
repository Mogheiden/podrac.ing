import { useState } from 'react';
import { newGame, printBoard } from './snek_gem';

export function SnekGame() {
  const [gameState] = useState(() => newGame());
  return (
    <pre>
      {printBoard(gameState)
        .split('\n')
        .map((row) => (
          <div>{row}</div>
        ))}
    </pre>
  );
}
