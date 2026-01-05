import React from 'react';
import PadButton from './PadButton';
import { motion } from 'framer-motion';

export default function PadGrid({ pads, activePadIndex, onPadTap, onEditPad, editMode }) {
  // Create array of 16 pads
  const gridPads = Array.from({ length: 16 }, (_, i) => {
    return pads?.find(p => p.index === i) || { index: i };
  });

  return (
    <motion.div 
      className="grid grid-cols-4 gap-2 md:gap-3 p-3 md:p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {gridPads.map((pad, index) => (
        <PadButton
          key={index}
          pad={pad}
          index={index}
          isActive={activePadIndex === index}
          onTap={onPadTap}
          onEdit={onEditPad}
          editMode={editMode}
        />
      ))}
    </motion.div>
  );
}
