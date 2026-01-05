import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Square, Layers, Save, FolderOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ControlBar({ editMode, onToggleEdit, onStop, onSave, onLoad, hasChanges }) {
  return (
    <motion.div 
      className="flex items-center justify-between gap-2 p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleEdit}
          className={`
            rounded-xl transition-all duration-200
            ${editMode 
              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
            }
          `}
        >
          <Settings className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Editar</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLoad}
          className="rounded-xl text-white/60 hover:text-white hover:bg-white/10"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Projetos</span>
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onStop}
          className="rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10"
        >
          <Square className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Parar</span>
        </Button>

        <Button
          size="sm"
          onClick={onSave}
          disabled={!hasChanges}
          className={`
            rounded-xl transition-all duration-200
            ${hasChanges 
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white' 
              : 'bg-white/10 text-white/40'
            }
          `}
        >
          <Save className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Guardar</span>
        </Button>
      </div>
    </motion.div>
  );
