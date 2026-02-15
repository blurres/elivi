import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';

const GRID_SIZE = 20;
const SPEED = 120;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function MiniGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef<Direction>('UP');
  const gameLoopRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateFood = (): Point => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  });

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setFood(generateFood());
    directionRef.current = 'UP';
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    if (containerRef.current) containerRef.current.focus();
  };

  const handleInput = useCallback((key: string) => {
    const currentDir = directionRef.current;

    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== 'DOWN') directionRef.current = 'UP';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== 'UP') directionRef.current = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== 'RIGHT') directionRef.current = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== 'LEFT') directionRef.current = 'RIGHT';
        break;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || gameOver) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      handleInput(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, handleInput, isPaused]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (directionRef.current) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          setScore((value) => value + 1);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, SPEED);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [food, gameOver, isPaused]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [highScore, score]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden select-none outline-none font-mono group"
      tabIndex={0}
      onClick={() => !isPaused && !gameOver && containerRef.current?.focus()}
    >
      <div
        className="relative bg-[#111] border-2 border-[#333] shadow-2xl transition-all"
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);

          let isSnake = false;
          let isHead = false;
          snake.forEach((segment, index) => {
            if (segment.x === x && segment.y === y) {
              isSnake = true;
              if (index === 0) isHead = true;
            }
          });

          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border-[0.5px] border-[#1a1a1a] transition-colors duration-100
                ${isHead ? 'bg-green-400 z-10' : ''}
                ${isSnake && !isHead ? 'bg-green-600/80' : ''}
                ${isFood ? 'bg-red-500 animate-pulse rounded-full transform scale-75' : ''}`}
            />
          );
        })}

        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%]" />
      </div>

      <div className="absolute top-2 left-0 w-full px-4 flex justify-between text-[10px] font-bold tracking-widest text-zinc-500 pointer-events-none z-30 mix-blend-difference">
        <span>
          SCORE: <span className="text-white">{score.toString().padStart(3, '0')}</span>
        </span>
        <span>
          HI: <span className="text-white">{highScore.toString().padStart(3, '0')}</span>
        </span>
      </div>

      {(isPaused || gameOver) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-40 p-4 text-center">
          {gameOver ? (
            <>
              <h3 className="text-xl font-black text-red-500 mb-1 tracking-tighter">GAME OVER</h3>
              <p className="text-xs text-zinc-400 mb-4">SCORE: {score}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-black font-bold hover:bg-zinc-200 uppercase tracking-widest text-[9px]"
              >
                <RefreshCw size={10} /> Retry
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-black text-white mb-1 tracking-tighter">SNAKE_OS</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-black font-bold hover:bg-zinc-200 uppercase tracking-widest text-[9px] animate-pulse"
              >
                <Play size={10} /> PLAY
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
