"use client";

import React, { useState, useRef } from "react";
import { useAudio } from "@/context/AudioContext";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Upload,
  Info,
  Music,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MusicPlayer() {
  const {
    playlist,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isMuted,
    togglePlay,
    nextTrack,
    prevTrack,
    selectTrack,
    toggleMute,
    toggleFullscreenVisualizer,
    loadCustomTrack,
  } = useAudio();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAttribution, setShowAttribution] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadCustomTrack(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="audio/*"
        className="hidden"
      />

      <div className="fixed bottom-6 right-6 z-40 font-sans">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            /* Collapsed Pill Button */
            <motion.button
              key="collapsed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setIsCollapsed(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 shadow-xl text-zinc-900 dark:text-zinc-100 hover:scale-105 transition-all group"
              aria-label="Open music player"
            >
              <div className={`p-1.5 rounded-full bg-indigo-500 text-white ${isPlaying ? "animate-spin [animation-duration:4s]" : ""}`}>
                <Music size={14} />
              </div>
              <span className="text-xs font-medium max-w-[120px] truncate">
                {currentTrack.title}
              </span>
              {isPlaying && (
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-indigo-500 animate-pulse h-full"></span>
                  <span className="w-0.5 bg-indigo-500 animate-pulse h-2"></span>
                  <span className="w-0.5 bg-indigo-500 animate-pulse h-3.5"></span>
                </span>
              )}
            </motion.button>
          ) : (
            /* Expanded Glassmorphic Player Card */
            <motion.div
              key="expanded"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-80 sm:w-96 rounded-3xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl border border-zinc-200/80 dark:border-white/10 shadow-2xl p-4 flex flex-col gap-3"
            >
              {/* Attribution Tooltip Popover */}
              <AnimatePresence>
                {showAttribution && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full mb-3 left-0 right-0 p-4 rounded-2xl bg-zinc-900/95 dark:bg-black/95 text-white backdrop-blur-xl border border-white/10 shadow-2xl text-xs z-50 space-y-2"
                  >
                    <div className="font-semibold text-indigo-400">Track Attribution & License</div>
                    <p className="text-zinc-300 leading-relaxed font-mono text-[11px]">
                      {currentTrack.attribution.song}
                    </p>
                    <p className="text-zinc-400 text-[11px]">
                      Provided by: <span className="text-white">{currentTrack.attribution.provider}</span>
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentTrack.attribution.downloadUrl && (
                        <a
                          href={currentTrack.attribution.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-200 underline"
                        >
                          Free Download/Stream <ExternalLink size={10} />
                        </a>
                      )}
                      {currentTrack.attribution.watchUrl && (
                        <a
                          href={currentTrack.attribution.watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-200 underline"
                        >
                          Watch Video <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top Row: Track details + Actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Vinyl Icon */}
                  <div
                    onClick={togglePlay}
                    className={`cursor-pointer w-10 h-10 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 ${
                      isPlaying ? "animate-spin [animation-duration:3s]" : ""
                    }`}
                  >
                    <Music size={18} />
                  </div>

                  {/* Title & Artist */}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {currentTrack.title}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {currentTrack.artist}
                    </div>
                  </div>
                </div>

                {/* Right utility buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Attribution Info Button */}
                  <button
                    onClick={() => setShowAttribution(!showAttribution)}
                    title="Track attribution & license"
                    className={`p-1.5 rounded-lg transition-colors ${
                      showAttribution
                        ? "bg-indigo-500 text-white"
                        : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Info size={15} />
                  </button>

                  {/* Fullscreen Visualizer Button */}
                  <button
                    onClick={toggleFullscreenVisualizer}
                    title="Full-screen audio visualizer"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Maximize2 size={15} />
                  </button>

                  {/* Collapse Button */}
                  <button
                    onClick={() => setIsCollapsed(true)}
                    title="Minimize player"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* Middle Row: Playback Controls & EQ */}
              <div className="flex items-center justify-between pt-1">
                {/* Dancing EQ Bars */}
                <div className="flex items-end gap-1 h-5 px-1">
                  <span className={`w-1 bg-indigo-500 rounded-full transition-all duration-150 ${isPlaying ? "h-4 animate-bounce" : "h-1"}`}></span>
                  <span className={`w-1 bg-indigo-500 rounded-full transition-all duration-200 ${isPlaying ? "h-5 animate-pulse" : "h-1.5"}`}></span>
                  <span className={`w-1 bg-indigo-500 rounded-full transition-all duration-300 ${isPlaying ? "h-3 animate-bounce" : "h-1"}`}></span>
                  <span className={`w-1 bg-indigo-500 rounded-full transition-all duration-150 ${isPlaying ? "h-4.5 animate-pulse" : "h-2"}`}></span>
                </div>

                {/* Primary Player Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevTrack}
                    className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Previous track"
                  >
                    <SkipBack size={16} />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Next track"
                  >
                    <SkipForward size={16} />
                  </button>
                </div>

                {/* Secondary Actions: Mute & Custom Upload */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload custom MP3"
                    className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Upload size={16} />
                  </button>
                </div>
              </div>

              {/* Bottom Playlist Switcher Pill Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none">
                {playlist.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(idx)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium whitespace-nowrap transition-all ${
                      idx === currentTrackIndex
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {track.title}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
