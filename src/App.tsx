import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Gamepad2, Mail, X } from 'lucide-react';
import Lenis from 'lenis';
import type { ProjectItem } from './types';

import { CommandDock } from './components/CommandDock';
import { ExpandedView } from './components/ExpandedView';
import { MiniGame } from './components/MiniGame';
import { ProjectCard } from './components/ProjectCard';
import { buildSeedProjects, siteConfig } from './data/portfolio';

export default function App() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [viewMode, setViewMode] = useState<'chaos' | 'grid'>('chaos');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const maxZIndexRef = useRef(20);
  const isSmallScreen = windowSize.width < 768;

  useEffect(() => {
    document.title = siteConfig.title;
  }, [siteConfig.title]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluate = () => {
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      const cores = navigator.hardwareConcurrency ?? 8;
      const lowPowerDevice = memory <= 4 || cores <= 4;

      setIsPerformanceMode(reducedMotion.matches || lowPowerDevice);
    };

    evaluate();
    reducedMotion.addEventListener('change', evaluate);

    return () => {
      reducedMotion.removeEventListener('change', evaluate);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSmallScreen && viewMode !== 'grid') {
      setViewMode('grid');
    }

    if (isSmallScreen && showGame) {
      setShowGame(false);
    }
  }, [isSmallScreen, showGame, viewMode]);

  useEffect(() => {
    if (items.length > 0) return;

    const centerX = windowSize.width / 2 - 130;
    const centerY = windowSize.height / 2 - 170;
    const seedProjects = buildSeedProjects(centerX, centerY);

    maxZIndexRef.current = 20;
    setItems(seedProjects);
  }, [items.length, windowSize.height, windowSize.width]);

  useEffect(() => {
    if (!scrollContainerRef.current || !scrollContainerRef.current.firstElementChild) return;

    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();

    return items.filter(
      (item) => item.title.toLowerCase().includes(query) || item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [items, searchQuery]);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach((item) => item.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [items]);

  const gridPositions = useMemo(() => {
    const cardWidth = 260;
    const cardHeight = 340;
    const gap = 20;
    const availableWidth = windowSize.width - 64;
    const columnCount = Math.max(1, Math.floor(availableWidth / (cardWidth + gap)));
    const gridWidth = columnCount * (cardWidth + gap) - gap;
    const startX = (windowSize.width - gridWidth) / 2;
    const startY = 150;

    return filteredItems.reduce<Record<string, { x: number; y: number }>>((acc, item, index) => {
      const col = index % columnCount;
      const row = Math.floor(index / columnCount);

      acc[item.id] = {
        x: startX + col * (cardWidth + gap),
        y: startY + row * (cardHeight + gap),
      };

      return acc;
    }, {});
  }, [filteredItems, windowSize.width]);

  const contentHeight = useMemo(() => {
    if (viewMode === 'grid') {
      const sorted = Object.values(gridPositions).sort((a, b) => b.y - a.y);
      const last = sorted[0];
      const gridBottom = last ? last.y + 400 : windowSize.height;
      return Math.max(windowSize.height, gridBottom);
    }

    const maxBottom = filteredItems.reduce((max, item) => {
      const bottom = item.y + item.height;
      return bottom > max ? bottom : max;
    }, 0);

    return Math.max(windowSize.height, maxBottom + 300);
  }, [filteredItems, gridPositions, viewMode, windowSize.height]);

  const expandedItem = filteredItems.find((item) => item.id === expandedItemId) ?? null;

  const handleUpdateItem = (id: string, updates: Partial<ProjectItem>) => {
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleFocusItem = (id: string) => {
    if (viewMode === 'grid') return;
    maxZIndexRef.current += 1;
    const zIndex = maxZIndexRef.current;
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, zIndex } : item)));
  };

  return (
    <div className={`relative h-screen w-screen bg-[#050505] selection:bg-white/20 ${isPerformanceMode ? '' : 'dot-pattern'}`}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="fixed inset-0 pointer-events-none z-[50]">
        <div className="absolute top-4 left-4 md:top-8 md:left-8 pointer-events-auto select-none max-w-sm">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-2">{siteConfig.title.toUpperCase()}</h1>
          <p className="text-[11px] md:text-xs font-mono text-zinc-400 leading-relaxed border-l border-zinc-700 pl-3 pr-2 max-w-[85vw] md:max-w-sm">{siteConfig.bio}</p>
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-3 pl-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>Orbit Stable</span>
          </div>
        </div>

        <div className="pointer-events-auto">
          <CommandDock
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalItems={filteredItems.length}
            tags={uniqueTags}
            forceGrid={isSmallScreen}
          />
        </div>

        {!isSmallScreen && (
          <motion.button
            className="fixed bottom-8 left-8 w-14 h-14 bg-black/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-40 group hover:scale-105 transition-transform pointer-events-auto"
            onClick={() => setShowGame(true)}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <Gamepad2 size={20} className="text-zinc-400 group-hover:text-green-400 transition-colors" />
              <span className="text-[7px] font-mono tracking-widest text-zinc-600 uppercase group-hover:text-zinc-300">PLAY</span>
            </div>
          </motion.button>
        )}

        <AnimatePresence>
          {viewMode === 'chaos' && (
            <motion.a
              href="mailto:contact@onyx.dev"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-8 right-8 pointer-events-auto"
            >
              <div className="relative group px-6 py-3 bg-black/50 border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:border-white/50 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <div className="relative flex items-center gap-2 mix-blend-difference text-white">
                  <Mail size={16} />
                  <span className="font-medium text-sm">Contact Me</span>
                  <ArrowUpRight size={16} className="w-0 opacity-0 -ml-2 group-hover:ml-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            </motion.a>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        ref={scrollContainerRef}
        className="relative w-full h-full overflow-y-auto overflow-x-hidden z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div style={{ height: contentHeight, minHeight: '100vh' }} className="w-full relative">
          {filteredItems.map((item) => {
            const x = viewMode === 'grid' ? gridPositions[item.id]?.x ?? item.x : item.x;
            const y = viewMode === 'grid' ? gridPositions[item.id]?.y ?? item.y : item.y;

            return (
              <ProjectCard
                key={item.id}
                item={item}
                x={x}
                y={y}
                isGridMode={viewMode === 'grid'}
                onUpdate={handleUpdateItem}
                onFocus={handleFocusItem}
                onExpand={setExpandedItemId}
              />
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {showGame && !isSmallScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/90 flex items-center justify-center p-6 md:p-12"
            onClick={() => setShowGame(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="relative w-full max-w-2xl aspect-square bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <Gamepad2 size={16} className="text-green-400" />
                  <span className="text-xs font-mono font-bold tracking-widest text-zinc-300">SNAKE_OS v1.0</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGame(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 w-full h-full overflow-hidden p-4 bg-black relative">
                <MiniGame />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expandedItem && (
          <ExpandedView item={expandedItem} onClose={() => setExpandedItemId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}