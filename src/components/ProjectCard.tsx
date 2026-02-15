import { motion } from 'framer-motion';
import type { ProjectItem } from '../types';
import { Maximize2, Play } from 'lucide-react';

type ProjectCardProps = {
  item: ProjectItem;
  x: number;
  y: number;
  isGridMode: boolean;
  onUpdate: (id: string, updates: Partial<ProjectItem>) => void;
  onFocus: (id: string) => void;
  onExpand: (id: string) => void;
};

export function ProjectCard({ item, x, y, isGridMode, onUpdate, onFocus, onExpand }: ProjectCardProps) {
  const showMedia = item.type === 'image' || item.type === 'video' || item.type === 'code';

  return (
    <motion.div
      drag={!isGridMode}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_, info) => {
        if (isGridMode) return;
        onUpdate(item.id, { x: item.x + info.offset.x, y: item.y + info.offset.y });
      }}
      onPointerDown={() => onFocus(item.id)}
      style={{ position: 'absolute', top: 0, left: 0 }}
      animate={{ x, y, rotate: isGridMode ? 0 : item.rotation }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <motion.div
        className="relative border border-white/15 bg-black/60 rounded-xl overflow-hidden text-left shadow-2xl"
        style={{
          width: isGridMode ? `min(${item.width}px, calc(100vw - 1.5rem))` : item.width,
          height: item.height,
          zIndex: item.zIndex,
        }}
        whileHover={{ scale: 1.02 }}
      >
        {showMedia && (
          <div className="relative w-full h-36 bg-black/70 overflow-hidden">
            {item.type === 'image' && <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />}
            {item.type === 'video' && <video src={item.mediaUrl} className="w-full h-full object-cover" loop muted playsInline preload="metadata" />}
            {item.type === 'code' && (
              <pre className="h-full w-full p-3 text-[10px] font-mono text-green-400 whitespace-pre-wrap overflow-hidden opacity-85 bg-[#0d1117]">
                {item.mediaUrl}
              </pre>
            )}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onExpand(item.id);
              }}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
            >
              <Maximize2 size={14} />
            </button>

            {item.type === 'video' && (
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/50 border border-white/10 text-white text-[10px] flex items-center gap-1">
                <Play size={10} /> LOOP
              </div>
            )}
          </div>
        )}

        <button type="button" onClick={() => onExpand(item.id)} className="w-full h-[calc(100%-9rem)] p-4 text-left">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{item.type}</p>
          <h2 className="mt-2 text-white font-bold tracking-tight text-lg">{item.title}</h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed line-clamp-2">{item.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-zinc-300 uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </button>
      </motion.div>
    </motion.div>
  );
}