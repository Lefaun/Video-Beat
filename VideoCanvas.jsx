import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoCanvas = forwardRef(({ activeVideo, onVideoEnd }, ref) => {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    stop: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }));

  useEffect(() => {
    if (videoRef.current && activeVideo?.video_url) {
      videoRef.current.play().catch(console.log);
    }
  }, [activeVideo]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none z-10" />
      
      <AnimatePresence mode="wait">
        {activeVideo?.video_url ? (
          <motion.video
            key={activeVideo.video_url}
            ref={videoRef}
            className="w-full h-full object-contain"
            loop={activeVideo.loop !== false}
            onEnded={onVideoEnd}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            playsInline
            muted
            autoPlay
            controls
          >
            <source src={activeVideo.video_url} type="video/mp4" />
            <source src={activeVideo.video_url} type="video/webm" />
            Teu navegador não suporta vídeo HTML5.
          </motion.video>
        ) : (
          <motion.div 
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                </div>
              </div>
              <p className="text-white/40 text-sm font-light tracking-wide">Toca num pad para projetar</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-purple-500/30 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-cyan-500/30 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-purple-500/30 rounded-br-2xl pointer-events-none" />
    </div>
  );
});

VideoCanvas.displayName = 'VideoCanvas';

export default VideoCanvas;
