import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './Button';
import { GameCategory } from '../types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Crosshair } from 'lucide-react';

interface ActiveGameProps {
  category: GameCategory;
  deviceType: 'mobile' | 'desktop';
  onGameOver?: (score: number) => void;
}

// --- SHARED TOUCH CONTROLS ---
const TouchControls: React.FC<{ 
  onDir: (dir: string) => void, 
  onAction?: () => void,
  actionLabel?: string 
}> = ({ onDir, onAction, actionLabel = "ACTION" }) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-40 select-none pointer-events-auto">
      {/* D-PAD */}
      <div className="relative w-32 h-32 bg-slate-800/50 rounded-full backdrop-blur-sm border border-slate-600/50">
        <button onPointerDown={() => onDir('up')} className="absolute top-0 left-10 w-12 h-12 bg-slate-700/80 rounded-t-lg active:bg-cyan-500/80 flex items-center justify-center border border-slate-500"><ArrowUp size={24} color="white"/></button>
        <button onPointerDown={() => onDir('down')} className="absolute bottom-0 left-10 w-12 h-12 bg-slate-700/80 rounded-b-lg active:bg-cyan-500/80 flex items-center justify-center border border-slate-500"><ArrowDown size={24} color="white"/></button>
        <button onPointerDown={() => onDir('left')} className="absolute left-0 top-10 w-12 h-12 bg-slate-700/80 rounded-l-lg active:bg-cyan-500/80 flex items-center justify-center border border-slate-500"><ArrowLeft size={24} color="white"/></button>
        <button onPointerDown={() => onDir('right')} className="absolute right-0 top-10 w-12 h-12 bg-slate-700/80 rounded-r-lg active:bg-cyan-500/80 flex items-center justify-center border border-slate-500"><ArrowRight size={24} color="white"/></button>
        <div className="absolute inset-0 m-auto w-8 h-8 bg-black/50 rounded-full"></div>
      </div>

      {/* ACTION BUTTON */}
      {onAction && (
        <button 
          onPointerDown={onAction}
          className="w-20 h-20 bg-red-600/80 rounded-full border-4 border-red-800 active:scale-95 active:bg-red-500 shadow-lg flex items-center justify-center backdrop-blur-sm"
        >
          <span className="font-bold text-white text-xs">{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

// --- PONG GAME ---
const PongGame: React.FC<{ deviceType: 'mobile' | 'desktop' }> = ({ deviceType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 }); // p1 = user, p2 = computer
  const [started, setStarted] = useState(false);

  // Game State
  const ball = useRef({ x: 400, y: 225, dx: 4, dy: 4, radius: 8 });
  const paddle1 = useRef({ y: 175, height: 80, width: 10 }); // Left (User)
  const paddle2 = useRef({ y: 175, height: 80, width: 10 }); // Right (AI)
  const animationRef = useRef<number>(0);

  const resetBall = () => {
      ball.current = { x: 400, y: 225, dx: -ball.current.dx, dy: 3, radius: 8 };
  };

  const update = useCallback(() => {
     if (!canvasRef.current) return;
     const canvas = canvasRef.current;
     const ctx = canvas.getContext('2d');
     if (!ctx) return;

     // Logic
     // Move Ball
     ball.current.x += ball.current.dx;
     ball.current.y += ball.current.dy;

     // Wall Collisions (Top/Bottom)
     if (ball.current.y + ball.current.radius > canvas.height || ball.current.y - ball.current.radius < 0) {
         ball.current.dy *= -1;
     }

     // Paddle Collisions
     // Left Paddle (Player)
     if (
         ball.current.x - ball.current.radius < 10 + paddle1.current.width &&
         ball.current.y > paddle1.current.y &&
         ball.current.y < paddle1.current.y + paddle1.current.height
     ) {
         ball.current.dx = Math.abs(ball.current.dx) * 1.05; // Speed up
         // Add some angle variation based on hit position
         const hitPoint = ball.current.y - (paddle1.current.y + paddle1.current.height / 2);
         ball.current.dy = hitPoint * 0.2; 
     }

     // Right Paddle (AI)
     if (
        ball.current.x + ball.current.radius > canvas.width - (10 + paddle2.current.width) &&
        ball.current.y > paddle2.current.y &&
        ball.current.y < paddle2.current.y + paddle2.current.height
    ) {
        ball.current.dx = -Math.abs(ball.current.dx) * 1.05;
    }

    // Scoring
    if (ball.current.x < 0) {
        setScore(s => ({ ...s, p2: s.p2 + 1 }));
        resetBall();
    }
    if (ball.current.x > canvas.width) {
        setScore(s => ({ ...s, p1: s.p1 + 1 }));
        resetBall();
    }

    // AI Movement (Simple tracking with some lag)
    const targetY = ball.current.y - paddle2.current.height / 2;
    // Lerp
    paddle2.current.y += (targetY - paddle2.current.y) * 0.08;
    // Bounds
    if (paddle2.current.y < 0) paddle2.current.y = 0;
    if (paddle2.current.y + paddle2.current.height > canvas.height) paddle2.current.y = canvas.height - paddle2.current.height;


     // Draw
     ctx.fillStyle = 'black';
     ctx.fillRect(0, 0, canvas.width, canvas.height);
     
     // Net
     ctx.strokeStyle = '#333';
     ctx.setLineDash([10, 15]);
     ctx.beginPath();
     ctx.moveTo(canvas.width / 2, 0);
     ctx.lineTo(canvas.width / 2, canvas.height);
     ctx.stroke();

     // Paddles
     ctx.fillStyle = 'white';
     ctx.fillRect(10, paddle1.current.y, paddle1.current.width, paddle1.current.height);
     ctx.fillRect(canvas.width - 20, paddle2.current.y, paddle2.current.width, paddle2.current.height);

     // Ball
     ctx.beginPath();
     ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2);
     ctx.fill();

     animationRef.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
      if (started) {
          animationRef.current = requestAnimationFrame(update);
      }
      return () => cancelAnimationFrame(animationRef.current);
  }, [started, update]);

  // Controls
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const relativeY = e.clientY - rect.top;
      // Map to canvas coordinates
      const scaleY = 450 / rect.height;
      const y = relativeY * scaleY - paddle1.current.height / 2;
      
      paddle1.current.y = y;
      // Bounds
      if (paddle1.current.y < 0) paddle1.current.y = 0;
      if (paddle1.current.y + paddle1.current.height > 450) paddle1.current.y = 450 - paddle1.current.height;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const relativeY = e.touches[0].clientY - rect.top;
      const scaleY = 450 / rect.height;
      const y = relativeY * scaleY - paddle1.current.height / 2;
      paddle1.current.y = y;
  };

  return (
      <div className="relative w-full h-full bg-black group overflow-hidden">
          {!started && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white">
                  <h2 className="text-4xl font-bold mb-4 retro-font text-white">PONG</h2>
                  <p className="mb-8 text-gray-400">Use seu mouse ou dedo para controlar a raquete esquerda.</p>
                  <Button onClick={() => setStarted(true)} size="lg">START GAME</Button>
              </div>
          )}
          
          <div className="absolute top-4 w-full flex justify-center gap-12 text-4xl font-mono font-bold text-white z-20 pointer-events-none">
              <span>{score.p1}</span>
              <span>{score.p2}</span>
          </div>

          <canvas
             ref={canvasRef}
             width={800}
             height={450}
             className="w-full h-full object-contain cursor-none touch-none"
             onMouseMove={handleMouseMove}
             onTouchMove={handleTouchMove}
          />
      </div>
  );
}


// --- SNAKE GAME ---
const SnakeGame: React.FC<{ onScore: (s: number) => void, deviceType: 'mobile' | 'desktop' }> = ({ onScore, deviceType }) => {
  const GRID_SIZE = 20;
  const SPEED = 100;
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  // Manual Direction Control (for Touch)
  const handleDir = (d: string) => {
    if (!started) setStarted(true);
    
    switch(d) {
      case 'up': if(dir.y === 0) setDir({x:0, y:-1}); break;
      case 'down': if(dir.y === 0) setDir({x:0, y:1}); break;
      case 'left': if(dir.x === 0) setDir({x:-1, y:0}); break;
      case 'right': if(dir.x === 0) setDir({x:1, y:0}); break;
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!started && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setStarted(true);
        setDir({ x: 1, y: 0 }); 
      }
      switch (e.key) {
        case 'ArrowUp': if (dir.y === 0) setDir({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (dir.y === 0) setDir({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (dir.x === 0) setDir({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (dir.x === 0) setDir({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir, started]);

  // Game Loop
  useEffect(() => {
    if (gameOver || !started) return;
    const move = setInterval(() => {
      setSnake(prev => {
        const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        
        // Wall collision
        if (newHead.x < 0 || newHead.x >= 30 || newHead.y < 0 || newHead.y >= 20) {
          setGameOver(true);
          onScore(score);
          return prev;
        }
        // Self collision
        if (prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          onScore(score);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        
        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood({
            x: Math.floor(Math.random() * 30),
            y: Math.floor(Math.random() * 20)
          });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(move);
  }, [dir, snake, food, gameOver, started, score]);

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black/80 text-white z-50 relative">
        <h2 className="text-3xl font-bold text-red-500 mb-4 retro-font">GAME OVER</h2>
        <p className="mb-6 text-xl">Score: {score}</p>
        <Button onClick={() => {
          setSnake([{ x: 10, y: 10 }]);
          setScore(0);
          setGameOver(false);
          setStarted(false);
          setDir({x: 0, y: 0});
        }}>Tentar Novamente</Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-900 border-4 border-slate-700 focus:outline-none outline-none group overflow-hidden" tabIndex={0}>
       {!started && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 pointer-events-none">
           <p className="retro-font text-white animate-pulse">
             {deviceType === 'mobile' ? 'TOUCH D-PAD TO START' : 'PRESS ARROWS TO START'}
           </p>
         </div>
       )}
       <div className="absolute top-2 left-4 text-white font-mono z-20">SCORE: {score}</div>
       
       {/* Game Board */}
       {snake.map((s, i) => (
         <div key={i} className="absolute bg-green-500 border border-green-600 rounded-sm" 
              style={{
                left: `${(s.x / 30) * 100}%`,
                top: `${(s.y / 20) * 100}%`,
                width: `${100/30}%`,
                height: `${100/20}%`
              }} 
         />
       ))}
       <div className="absolute bg-red-500 rounded-full shadow-[0_0_10px_red]"
            style={{
                left: `${(food.x / 30) * 100}%`,
                top: `${(food.y / 20) * 100}%`,
                width: `${100/30}%`,
                height: `${100/20}%`
            }} 
       />

       {deviceType === 'mobile' && !gameOver && (
          <TouchControls onDir={handleDir} />
       )}
    </div>
  );
};

// --- SHOOTER GAME ---
const ShooterGame: React.FC<{ deviceType: 'mobile' | 'desktop' }> = ({ deviceType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  // Game State Refs (for performance)
  const player = useRef({ x: 50, y: 90, w: 5, h: 5, dx: 0 });
  const bullets = useRef<{x: number, y: number}[]>([]);
  const enemies = useRef<{x: number, y: number, speed: number}[]>([]);
  const frameRef = useRef<number>(0);
  const lastEnemyTime = useRef<number>(0);
  const touchInterval = useRef<any>(null);

  const resetGame = () => {
    player.current = { x: 50, y: 90, w: 5, h: 5, dx: 0 };
    bullets.current = [];
    enemies.current = [];
    setScore(0);
    setGameOver(false);
    lastEnemyTime.current = 0;
  };

  // Touch Handlers
  const startMove = (dir: string) => {
    if (dir === 'left') player.current.dx = -1.5;
    if (dir === 'right') player.current.dx = 1.5;
  };
  
  // Need to clear movement on touch release, 
  // but for simple D-Pad click we can just set a timeout or rely on hold.
  // For simplicity in this structure: click = nudge, hold is complex without more listeners.
  // Let's implement a simple nudge for touch
  const nudge = (dir: string) => {
     if (dir === 'left') player.current.x -= 5;
     if (dir === 'right') player.current.x += 5;
     if (dir === 'up') player.current.y -= 5;
     if (dir === 'down') player.current.y += 5;
  }

  const fire = () => {
    bullets.current.push({ x: player.current.x + 2.5, y: player.current.y });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') player.current.dx = -1.5;
      if (e.key === 'ArrowRight') player.current.dx = 1.5;
      if (e.code === 'Space') fire();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.current.dx = 0;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const update = useCallback((time: number) => {
    if (gameOver) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    const canvas = canvasRef.current;
    
    // Clear
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update Player
    player.current.x += player.current.dx;
    if (player.current.x < 0) player.current.x = 0;
    if (player.current.x > 100 - player.current.w) player.current.x = 100 - player.current.w;

    // Draw Player
    ctx.fillStyle = '#06b6d4'; // Cyan
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#06b6d4';
    ctx.fillRect(
      (player.current.x / 100) * canvas.width, 
      (player.current.y / 100) * canvas.height, 
      (player.current.w / 100) * canvas.width, 
      (player.current.h / 100) * canvas.height
    );
    ctx.shadowBlur = 0;

    // Spawn Enemies
    if (time - lastEnemyTime.current > 1000) {
      enemies.current.push({ 
        x: Math.random() * 90, 
        y: -5, 
        speed: 0.2 + Math.random() * 0.3 
      });
      lastEnemyTime.current = time;
    }

    // Update & Draw Bullets
    ctx.fillStyle = '#facc15'; // Yellow
    bullets.current.forEach((b, i) => {
      b.y -= 2;
      ctx.fillRect(
        (b.x / 100) * canvas.width, 
        (b.y / 100) * canvas.height, 
        (1 / 100) * canvas.width, 
        (3 / 100) * canvas.height
      );
      if (b.y < 0) bullets.current.splice(i, 1);
    });

    // Update & Draw Enemies
    ctx.fillStyle = '#ef4444'; // Red
    enemies.current.forEach((e, i) => {
      e.y += e.speed;
      ctx.fillRect(
        (e.x / 100) * canvas.width, 
        (e.y / 100) * canvas.height, 
        (5 / 100) * canvas.width, 
        (5 / 100) * canvas.height
      );

      // Collision Bullet-Enemy
      bullets.current.forEach((b, bi) => {
        if (b.x > e.x && b.x < e.x + 5 && b.y > e.y && b.y < e.y + 5) {
          enemies.current.splice(i, 1);
          bullets.current.splice(bi, 1);
          setScore(s => s + 100);
        }
      });

      // Collision Enemy-Player (Game Over)
      if (
        player.current.x < e.x + 5 &&
        player.current.x + player.current.w > e.x &&
        player.current.y < e.y + 5 &&
        player.current.h + player.current.y > e.y
      ) {
        setGameOver(true);
      }
      
      // Cleanup enemies
      if (e.y > 100) enemies.current.splice(i, 1);
    });

    frameRef.current = requestAnimationFrame(update);
  }, [gameOver]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current);
  }, [update]);

  return (
    <div className="relative w-full h-full bg-slate-900 group overflow-hidden">
      {gameOver && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white">
          <h2 className="text-3xl font-bold text-red-500 mb-4 retro-font">MISSION FAILED</h2>
          <p className="mb-6 text-xl">Score: {score}</p>
          <Button onClick={resetGame}>RESTART MISSION</Button>
        </div>
      )}
      <div className="absolute top-2 left-4 text-white font-mono z-20 pointer-events-none drop-shadow-md">
         SCORE: {score} <span className="ml-4 text-xs text-gray-400 hidden md:inline">ARROWS to Move, SPACE to Shoot</span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={450} 
        className="w-full h-full object-contain bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
      />
      
      {deviceType === 'mobile' && !gameOver && (
         <TouchControls onDir={nudge} onAction={fire} actionLabel="FIRE" />
      )}
    </div>
  );
};


export const ActiveGame: React.FC<ActiveGameProps> = ({ category, deviceType }) => {
  // Mapping categories to specific games
  if (category === GameCategory.PUZZLE) {
      return <SnakeGame onScore={() => {}} deviceType={deviceType} />;
  } else if (category === GameCategory.RACING || category === GameCategory.STRATEGY) {
      // Mapping Racing and Strategy to Pong for variety
      return <PongGame deviceType={deviceType} />;
  } else {
      // Default / Action / RPG
      return <ShooterGame deviceType={deviceType} />;
  }
};