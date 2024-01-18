import { useEffect, useState } from 'react';
import { changeDir, newGame, printBoard, step } from './snek_gem';
import { Link } from 'react-router-dom';

export function SnekGame() {
  const [gameState, setGameState] = useState(() => newGame());

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((state) => step(state));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const directions = (e: KeyboardEvent) => {
      if (
        (e.key === 'a' || e.key === 'ArrowLeft') &&
        gameState.direction !== 'E'
      ) {
        setGameState((state) => changeDir(state, 'W'));
      }
      if (
        (e.key === 'd' || e.key === 'ArrowRight') &&
        gameState.direction !== 'W'
      ) {
        setGameState((state) => changeDir(state, 'E'));
      }
      if (
        (e.key === 'w' || e.key === 'ArrowUp') &&
        gameState.direction !== 'S'
      ) {
        setGameState((state) => changeDir(state, 'N'));
      }
      if (
        (e.key === 's' || e.key === 'ArrowDown') &&
        gameState.direction !== 'N'
      ) {
        setGameState((state) => changeDir(state, 'S'));
      }
    };
    document.addEventListener('keydown', directions);
    return () => document.removeEventListener('keydown', directions);
  }, [gameState.direction]);

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
