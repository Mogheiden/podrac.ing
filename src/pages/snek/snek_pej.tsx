import { useEffect, useState } from 'react';
import { newGame, printBoard, step } from './snek_gem';
import { Link } from 'react-router-dom';

export function SnekGame() {
  const [gameState, setGameState] = useState(() => newGame());

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((state) => step(state));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <pre>
      {printBoard(gameState)
        .split('\n')
        .map((row) => (
          <div>{row}</div>
        ))}
      <Link to="/">bepis</Link>
    </pre>
  );
}
