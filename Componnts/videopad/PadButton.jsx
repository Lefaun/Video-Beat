import React from 'react';
import { motion } from 'framer-motion';
import { Play, Upload, Video } from 'lucide-react';

const PAD_COLORS = [
  'from-purple-500 to-purple-700',
  'from-cyan-500 to-cyan-700',
  'from-pink-500 to-pink-700',
  'from-amber-500 to-amber-700',
  'from-emerald-500 to-emerald-700',
  'from-rose-500 to-rose-700',
  'from-blue-500 to-blue-700',
  'from-orange-500 to-orange-700',
  'from-teal-500 to-teal-700',
  'from-indigo-500 to-indigo-700',
  'from-lime-500 to-lime-700',
  'from-fuchsia-500 to-fuchsia-700',
  'from-red-500 to-red-700',
  'from-sky-500 to-sky-700',
  'from-violet-500 to-violet-700',
  'from-yellow-500 to-yellow-700',
];

export default function PadButton({ pad, index, isActive, onTap, onEdit, editMode }) {
  const hasVideo = pad?.video_url;
  const gradient = PAD_COLORS[index % PAD_COLORS.length];
  
  const handleClick = () => {
    if (editMode) {
      onEdit(index);
    } else if (hasVideo) {
      onTap(pad, index);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative aspect-square rounded-xl overflow-hidden
        transition-all duration-200 ease-out
        ${hasVideo 
          ? `bg-gradient-to-br ${gradient} shadow-lg` 
          : 'bg-white/5 border border-dashed border-white/20 hover:border-white/40'
        }
        ${isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-black shadow-xl shadow-white/20' : ''}
        ${editMode && hasVideo ? 'ring-2 ring-yellow-400/50' : ''}
      `}
    >
      {/* Glow effect when active */}
      {isActive && (
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 blur-xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
        {hasVideo ? (
          <>
            <motion.div
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Video className={`w-6 h-6 md:w-8 md:h-8 ${isActive ? 'text-white' : 'text-white/80'}`} />
            </motion.div>
