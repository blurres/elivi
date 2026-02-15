import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, ChevronDown, ChevronUp, Grid, Hash, Move, Search } from 'lucide-react';

interface CommandDockProps {
  viewMode: 'chaos' | 'grid';
  setViewMode: (mode: 'chaos' | 'grid') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalItems: number;
  tags: string[];
  forceGrid?: boolean;
}

export function CommandDock({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  totalItems,
  tags,
  forceGrid = false,
}: CommandDockProps) {
  const [showTags, setShowTags] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (forceGrid) {
    return (
      <div className="fixed bottom-4 right-4 z-[90] pointer-events-auto">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute bottom-14 right-0 w-64 max-w-[90vw] p-3 bg-black/80 border border-white/10 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Search size={14} className="text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter archive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-zinc-600 font-mono"
                />
              </div>

              <button
                onClick={() => setShowTags(!showTags)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-white/10 bg-white/5 text-zinc-300"
              >
                <span className="flex items-center gap-2">
                  <Hash size={12} /> Tags
                </span>
                {showTags ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <AnimatePresence>
                {showTags && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 max-h-28 overflow-y-auto flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            if (searchQuery === tag) setSearchQuery('');
                            else setSearchQuery(tag);
                          }}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all ${
                            searchQuery === tag
                              ? 'bg-white text-black border-white'
                              : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/30'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                      {tags.length === 0 && <span className="text-zinc-500 text-xs font-mono">No tags available</span>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 bg-white rounded-full text-black px-2.5 py-1.5 text-xs font-medium">
                  <Grid size={12} /> Grid mode
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 rounded-full border border-white/5">
                  <Box size={10} className="text-zinc-500" />
                  <span className="text-[10px] font-mono text-zinc-400">{totalItems.toString().padStart(2, '0')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-11 h-11 rounded-full bg-black/80 border border-white/15 text-white flex items-center justify-center shadow-2xl"
          title="Open controls"
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showTags && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
            className="fixed bottom-20 md:bottom-24 left-1/2 z-[90] w-max max-w-[94vw] md:max-w-[90vw] flex flex-wrap justify-center gap-2 p-2.5 md:p-3 bg-black/60 border border-white/10 rounded-2xl shadow-2xl"
          >
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (searchQuery === tag) setSearchQuery('');
                  else setSearchQuery(tag);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                  searchQuery === tag
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
            {tags.length === 0 && <span className="text-zinc-500 text-xs font-mono">No tags available</span>}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2 md:gap-4 p-2 pl-3 md:pl-4 pr-2 bg-black/60 border border-white/10 rounded-full shadow-2xl max-w-[95vw]"
      >
        <div className="flex items-center gap-2 group">
          <Search size={14} className="text-zinc-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Filter archive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-20 md:w-24 focus:w-28 md:focus:w-48 transition-all duration-300 text-white placeholder-zinc-600 font-mono"
          />
        </div>

        <div className="w-px h-4 bg-white/10" />

        <button
          onClick={() => setShowTags(!showTags)}
          className={`p-2 rounded-full transition-all duration-300 relative ${
            showTags || (searchQuery && tags.includes(searchQuery)) ? 'text-white' : 'text-zinc-400 hover:text-white'
          }`}
          title="Filter by Tags"
        >
          <Hash size={14} />
          {(showTags || (searchQuery && tags.includes(searchQuery))) && (
            <motion.div layoutId="dock-indicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
          )}
        </button>

        <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
          {!forceGrid && (
            <button
              onClick={() => setViewMode('chaos')}
              className={`p-2 rounded-full transition-all duration-300 relative ${
                viewMode === 'chaos' ? 'text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {viewMode === 'chaos' && (
                <motion.div
                  layoutId="dock-pill"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                <Move size={14} />
              </span>
            </button>
          )}

          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-full transition-all duration-300 relative ${
              viewMode === 'grid' || forceGrid ? 'text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {(viewMode === 'grid' || forceGrid) && (
              <motion.div
                layoutId="dock-pill"
                className="absolute inset-0 bg-white rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">
              <Grid size={14} />
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-white/5">
          <Box size={10} className="text-zinc-500" />
          <span className="text-[9px] font-mono text-zinc-400">{totalItems.toString().padStart(2, '0')} items</span>
        </div>
      </motion.div>
    </>
  );
}
