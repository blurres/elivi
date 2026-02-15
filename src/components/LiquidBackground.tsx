import { memo } from 'react';
import { motion } from 'framer-motion';

export const LiquidBackground = memo(() => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-50 bg-black">
      <div className="absolute inset-0 opacity-40">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-zinc-800/20 blur-[100px] mix-blend-screen"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.1, 1, 1.1],
            rotate: [0, -60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-zinc-700/10 blur-[90px] mix-blend-screen"
          animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-20%', '20%', '-20%'],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-indigo-900/10 blur-[80px] mix-blend-screen"
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />
    </div>
  );
});

LiquidBackground.displayName = 'LiquidBackground';
