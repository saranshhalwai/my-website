"use client";

import React, { useState, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import ShaderHeroBackground from "@/components/HeroBackground";
import { Play, Pause, SkipForward, SkipBack, Minimize2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FullscreenVisualizer() {
  const {
    currentTrack,
    isPlaying,
    isFullscreenVisualizer,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleFullscreenVisualizer,
  } = useAudio();

  const [controlsVisible, setControlsVisible] = useState(true);

  // Auto-hide controls on inactivity
  useEffect(() => {
    if (!isFullscreenVisualizer) return;

    let timer: NodeJS.Timeout;
    const handleActivity = () => {
      setControlsVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setControlsVisible(false), 3500);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    handleActivity();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearTimeout(timer);
    };
  }, [isFullscreenVisualizer]);

  // Press ESC to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreenVisualizer) {
        toggleFullscreenVisualizer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenVisualizer, toggleFullscreenVisualizer]);

  if (!isFullscreenVisualizer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-black select-none font-sans"
      >
        {/* Fullscreen Shader Canvas */}
        <ShaderHeroBackground isCover={true} />

        {/* Dynamic Controls Overlay */}
        <motion.div
          animate={{ opacity: controlsVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full h-full flex flex-col justify-between p-8 pointer-events-none"
        >
          {/* Top Bar */}
          <div className="flex items-start justify-between w-full pointer-events-auto">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono uppercase tracking-wider mb-2 border border-indigo-500/30 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                Audio Visualizer Mode
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white drop-shadow-md">
                {currentTrack.title}
              </h2>
              <p className="text-lg text-zinc-300 font-sans mt-1">
                {currentTrack.artist}
              </p>

              {/* Attribution info */}
              <div className="text-xs text-zinc-400 mt-2 max-w-md font-mono flex flex-wrap items-center gap-3">
                <span>{currentTrack.attribution.provider}</span>
                {currentTrack.attribution.downloadUrl && (
                  <a
                    href={currentTrack.attribution.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 underline"
                  >
                    Download <ExternalLink size={10} />
                  </a>
                )}
                {currentTrack.attribution.watchUrl && (
                  <a
                    href={currentTrack.attribution.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 underline"
                  >
                    Watch <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>

            {/* Exit Fullscreen Button */}
            <button
              onClick={toggleFullscreenVisualizer}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/20 transition-all hover:scale-105"
              title="Exit Visualizer Mode (Esc)"
            >
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Bottom Control Bar */}
          <div className="w-full flex items-center justify-center pointer-events-auto pb-4">
            <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-black/50 backdrop-blur-2xl border border-white/15 shadow-2xl">
              <button
                onClick={prevTrack}
                className="p-2.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Previous"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlay}
                className="p-4 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 hover:scale-105 transition-all"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </button>

              <button
                onClick={nextTrack}
                className="p-2.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Next"
              >
                <SkipForward size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
