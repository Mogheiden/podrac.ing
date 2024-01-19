import { useEffect, useState } from 'react';
import { changeDir, newGame, printBoard, step } from './snek_gem';
import { Link } from 'react-router-dom';

type ModalType = 'intro' | 'gameOver';

export function SnekGame() {
  const [gameState, setGameState] = useState(() => newGame());
  const [modalState, setModal] = useState<ModalType | null>('intro');

  useEffect(() => {
    if (gameState.gameOver) {
      setModal('gameOver');
    }
  }, [gameState]);

  useEffect(() => {
    if (!modalState) {
      const interval = setInterval(() => {
        setGameState((state) => step(state));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [modalState]);

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

  function renderModalContent(modal: ModalType) {
    switch (modal) {
      case 'intro':
        return (
          <>
            <div style={{ color: 'white', fontSize: '24px' }}>
              Welcome to Snek! Controls W A S D or Arrow Keys.
            </div>
            <br />
            <button onClick={() => setModal(null)}>Begin!</button>
          </>
        );
      case 'gameOver':
        return (
          <>
            <div style={{ color: 'white', fontSize: '24px' }}>
              Game over. You scored {gameState.score} points!
            </div>
            <br />
            <button
              onClick={() => {
                setGameState(newGame());
                setModal(null);
              }}
            >
              Retry
            </button>
          </>
        );
    }
    throw new Error('Invalid modal state');
  }

  return (
    <div>
      <pre>
        {printBoard(gameState)
          .split('\n')
          .map((row) => (
            <div>{row}</div>
          ))}
        <Link to="/">bepis</Link>
      </pre>

      {modalState ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000BB',
          }}
        >
          <div>{renderModalContent(modalState)}</div>
        </div>
      ) : undefined}
    </div>
  );
}
