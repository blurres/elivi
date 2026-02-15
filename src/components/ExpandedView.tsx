import { motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import type { ProjectItem } from '../types';
import { MiniGame } from './MiniGame';

interface ExpandedViewProps {
  item: ProjectItem;
  onClose: () => void;
}

const ModelViewer = ({ src, alt }: { src: string; alt: string }) => {
  // @ts-ignore custom element
  return <model-viewer src={src} alt={alt} auto-rotate camera-controls shadow-intensity="1" style={{ width: '100%', height: '100%' }} />;
};

export function ExpandedView({ item, onClose }: ExpandedViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        className="relative w-full max-w-7xl h-[85vh] bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-zinc-400 hover:bg-white hover:text-black rounded-full transition-all border border-white/10"
        >
          <X size={24} />
        </button>

        <div className="w-full md:w-2/3 h-1/2 md:h-full bg-black/50 flex items-center justify-center relative overflow-hidden group border-b md:border-b-0 md:border-r border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black -z-10" />

          {item.type === 'image' && (
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="w-full h-full object-contain p-4 select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          )}

          {item.type === 'video' && (
            <video
              src={item.mediaUrl}
              controls
              controlsList="nodownload"
              preload="metadata"
              className="w-full h-full max-h-[80vh] object-contain select-none"
              onContextMenu={(e) => e.preventDefault()}
            />
          )}

          {item.type === 'code' && (
            <div className="w-full h-full overflow-auto custom-scrollbar p-8 bg-[#0d1117]">
              <pre className="text-sm md:text-base font-mono text-green-400 whitespace-pre-wrap select-text">
                <code>{item.mediaUrl}</code>
              </pre>
            </div>
          )}

          {item.type === 'model3d' && (
            <div className="w-full h-full bg-[#111]">
              <ModelViewer src={item.mediaUrl} alt={item.title} />
            </div>
          )}

          {item.type === 'game' && (
            <div className="w-full h-full">
              <MiniGame />
            </div>
          )}

          {(item.type === 'audio' || item.type === 'other' || item.type === 'website' || item.type === 'app') && (
            <div className="text-zinc-500 font-mono text-lg p-8 text-center border border-white/10 rounded-xl">
              Media Preview Not Available for {item.type}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 h-1/2 md:h-full bg-[#09090b] flex flex-col p-8 md:p-10 overflow-y-auto">
          <div className="mb-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-black bg-white rounded-sm">{item.type}</span>
              <span className="text-xs font-mono text-zinc-500">ID: {item.id.slice(0, 8)}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">{item.title}</h2>

            <div className="flex flex-wrap gap-2 mb-8">
              {item.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 text-xs uppercase tracking-wide text-zinc-400 border border-white/10 rounded-full hover:border-white/30 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>

            <p className="text-lg text-zinc-300 leading-relaxed font-light mb-8">{item.description}</p>
          </div>

          <div className="pt-8 border-t border-white/10 mt-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-widest text-zinc-500">Project Meta</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
                <div className="flex flex-col">
                  <span className="text-zinc-600 text-xs mb-1">Created</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-600 text-xs mb-1">Status</span>
                  <span>Archived</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white rounded-lg flex items-center justify-center gap-2 transition-all group">
              <span>View Source / External</span>
              <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
