import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Disc3 } from 'lucide-react';
import VideoCanvas from '../components/videopad/VideoCanvas';
import PadGrid from '../components/videopad/PadGrid';
import ControlBar from '../components/videopad/ControlBar';
import PadEditor from '../components/videopad/PadEditor';
import ProjectsModal from '../components/videopad/ProjectsModal';
import NewProjectModal from '../components/videopad/NewProjectModal';

export default function VideoPadPage() {
  const queryClient = useQueryClient();
  const videoRef = useRef(null);
  
  const [activeVideo, setActiveVideo] = useState(null);
  const [activePadIndex, setActivePadIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPadIndex, setEditingPadIndex] = useState(null);
  const [showProjects, setShowProjects] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [localPads, setLocalPads] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['videoPads'],
    queryFn: () => base44.entities.VideoPad.list('-created_date'),
  });

  // Mutations
  const createProject = useMutation({
    mutationFn: (data) => base44.entities.VideoPad.create(data),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['videoPads'] });
      setCurrentProject(newProject);
      setLocalPads(newProject.pads || []);
      setHasChanges(false);
      setShowNewProject(false);
    },
  });

  const updateProject = useMutation({
    mutationFn: ({ id, data }) => base44.entities.VideoPad.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoPads'] });
      setHasChanges(false);
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id) => base44.entities.VideoPad.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoPads'] });
      if (currentProject?.id === deleteProject.variables) {
        setCurrentProject(null);
        setLocalPads([]);
      }
    },
  });

  // Handle pad tap
  const handlePadTap = (pad, index) => {
    if (pad.video_url) {
      setActiveVideo(pad);
      setActivePadIndex(index);
    }
  };

  // Handle stop
  const handleStop = () => {
    setActiveVideo(null);
    setActivePadIndex(null);
    videoRef.current?.stop();
  };

  // Handle pad edit
  const handleEditPad = (index) => {
    const existingPad = localPads.find(p => p.index === index);
    setEditingPadIndex(index);
  };

  // Handle pad save from editor
  const handleSavePad = (padData) => {
    const newPads = localPads.filter(p => p.index !== padData.index);
    if (padData.video_url) {
      newPads.push(padData);
    }
    setLocalPads(newPads);
    setHasChanges(true);
  };

  // Handle project selection
  const handleSelectProject = (project) => {
    setCurrentProject(project);
    setLocalPads(project.pads || []);
    setHasChanges(false);
    setShowProjects(false);
    handleStop();
  };

  // Handle create new project
  const handleCreateProject = (name) => {
    createProject.mutate({ name, pads: [] });
  };

  // Handle save project
  const handleSaveProject = () => {
    if (currentProject) {
      updateProject.mutate({
        id: currentProject.id,
        data: { pads: localPads },
      });
    }
  };

  // Get editing pad data
  const editingPadData = editingPadIndex !== null 
    ? localPads.find(p => p.index === editingPadIndex) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-center gap-3 mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <Disc3 className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-full h-full rounded-full border border-dashed border-purple-500/30" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
              Video Pad
            </h1>
            {currentProject && (
              <p className="text-xs text-white/40">{currentProject.name}</p>
            )}
          </div>
        </motion.div>

        {/* Video Canvas */}
        <div className="mb-4 md:mb-6">
          <VideoCanvas
            ref={videoRef}
            activeVideo={activeVideo}
            onVideoEnd={handleStop}
          />
        </div>

        {/* Control Bar */}
        <div className="mb-4 md:mb-6">
          <ControlBar
            editMode={editMode}
            onToggleEdit={() => setEditMode(!editMode)}
            onStop={handleStop}
            onSave={handleSaveProject}
            onLoad={() => setShowProjects(true)}
            hasChanges={hasChanges}
          />
        </div>

        {/* Pad Grid */}
        {currentProject ? (
          <PadGrid
            pads={localPads}
            activePadIndex={activePadIndex}
            onPadTap={handlePadTap}
            onEditPad={handleEditPad}
            editMode={editMode}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10"
          >
            <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
              <Disc3 className="w-10 h-10 text-white/40" />
            </div>
            <p className="text-white/60 text-center mb-4">
              Começa por criar ou carregar um projeto
            </p>
            <button
              onClick={() => setShowProjects(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl font-medium transition-all"
            >
              Ver Projetos
            </button>
          </motion.div>
        )}

        {/* Modals */}
        <PadEditor
          isOpen={editingPadIndex !== null}
          padIndex={editingPadIndex}
          padData={editingPadData}
          onSave={handleSavePad}
          onClose={() => setEditingPadIndex(null)}
        />

        <ProjectsModal
          isOpen={showProjects}
          projects={projects}
          isLoading={isLoading}
          onSelect={handleSelectProject}
          onDelete={(id) => deleteProject.mutate(id)}
          onCreate={() => {
            setShowProjects(false);
            setShowNewProject(true);
          }}
          onClose={() => setShowProjects(false)}
        />

        <NewProjectModal
          isOpen={showNewProject}
          onSave={handleCreateProject}
          onClose={() => setShowNewProject(false)}
        />
      </div>
    </div>
  );
}
