"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export interface TrackAttribution {
  song: string;
  provider: string;
  downloadUrl?: string;
  watchUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  attribution: TrackAttribution;
}

export const PLAYLIST: Track[] = [
  {
    id: "fade",
    title: "Fade",
    artist: "Alan Walker",
    src: "/audio/fade.mp3",
    attribution: {
      song: "Alan Walker - Fade [NCS Release]",
      provider: "NoCopyrightSounds",
    },
  },
  {
    id: "on-and-on",
    title: "On & On (feat. Daniel Levi)",
    artist: "Cartoon, Jéja",
    src: "/audio/on-and-on.mp3",
    attribution: {
      song: "Cartoon, Jéja - On & On (feat. Daniel Levi) [NCS Release]",
      provider: "NoCopyrightSounds",
      downloadUrl: "http://ncs.io/onandon",
      watchUrl: "http://youtu.be/K4DyBUG242c",
    },
  },
  {
    id: "sky-high",
    title: "Sky High",
    artist: "Elektronomia",
    src: "/audio/sky-high.mp3",
    attribution: {
      song: "Elektronomia - Sky High [NCS Release]",
      provider: "NoCopyrightSounds",
      downloadUrl: "http://ncs.io/skyhigh",
      watchUrl: "http://youtu.be/TW9d8vYrVFQ",
    },
  },
];

export interface AudioMetrics {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
}

interface AudioContextType {
  playlist: Track[];
  currentTrack: Track;
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isFullscreenVisualizer: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleFullscreenVisualizer: () => void;
  loadCustomTrack: (file: File) => void;
  getAudioMetrics: () => AudioMetrics;
}

const AudioVisualizerContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Track[]>(PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreenVisualizer, setIsFullscreenVisualizer] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Fallback smoothed audio values
  const currentMetrics = useRef<AudioMetrics>({ bass: 0, mid: 0, treble: 0, energy: 0 });

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  const initWebAudio = () => {
    if (audioContextRef.current || !audioRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;
    } catch (err) {
      console.warn("Web Audio API initialization failed:", err);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    initWebAudio();

    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback error:", err);
      }
    }
  };

  const playTrackAtIndex = async (index: number) => {
    initWebAudio();
    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume().catch(() => {});
    }
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    playTrackAtIndex(nextIdx);
  };

  const prevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrackAtIndex(prevIdx);
  };

  const selectTrack = (index: number) => {
    if (index >= 0 && index < playlist.length) {
      playTrackAtIndex(index);
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreenVisualizer = () => {
    setIsFullscreenVisualizer((prev) => !prev);
  };

  const loadCustomTrack = (file: File) => {
    const url = URL.createObjectURL(file);
    const newTrack: Track = {
      id: `custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Upload",
      src: url,
      attribution: {
        song: file.name,
        provider: "Uploaded by User",
      },
    };
    setPlaylist((prev) => [newTrack, ...prev]);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
  };

  // Sync volume and src when currentTrack changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.src;
    audioRef.current.volume = isMuted ? 0 : volume;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, currentTrack.src, isPlaying, isMuted, volume]);

  // Audio metrics extraction loop
  const getAudioMetrics = (): AudioMetrics => {
    const analyser = analyserRef.current;
    if (!analyser || !isPlaying) {
      // Smoothly decay to 0
      currentMetrics.current.bass *= 0.85;
      currentMetrics.current.mid *= 0.85;
      currentMetrics.current.treble *= 0.85;
      currentMetrics.current.energy *= 0.85;
      return currentMetrics.current;
    }

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqData);

    // Bass: bins 1 to 6 (~20Hz to ~250Hz)
    let bassSum = 0;
    const bassCount = 6;
    for (let i = 1; i <= bassCount; i++) {
      bassSum += freqData[i];
    }
    const rawBass = Math.min(1.0, (bassSum / (bassCount * 255)) * 1.4);

    // Mid: bins 7 to 28 (~250Hz to ~2500Hz)
    let midSum = 0;
    const midCount = 22;
    for (let i = 7; i < 7 + midCount; i++) {
      midSum += freqData[i];
    }
    const rawMid = Math.min(1.0, (midSum / (midCount * 255)) * 1.6);

    // Treble: bins 29 to 75 (~2500Hz to ~10000Hz)
    let trebleSum = 0;
    const trebleCount = 47;
    for (let i = 29; i < 29 + trebleCount; i++) {
      trebleSum += freqData[i];
    }
    const rawTreble = Math.min(1.0, (trebleSum / (trebleCount * 255)) * 1.8);

    // Total Energy
    let totalSum = 0;
    for (let i = 0; i < freqData.length; i++) {
      totalSum += freqData[i];
    }
    const rawEnergy = Math.min(1.0, (totalSum / (freqData.length * 255)) * 1.5);

    // Refined, natural attack/decay smoothing
    const smooth = (curr: number, target: number) => {
      const factor = target > curr ? 0.24 : 0.08;
      return curr + (target - curr) * factor;
    };

    currentMetrics.current = {
      bass: smooth(currentMetrics.current.bass, rawBass),
      mid: smooth(currentMetrics.current.mid, rawMid),
      treble: smooth(currentMetrics.current.treble, rawTreble),
      energy: smooth(currentMetrics.current.energy, rawEnergy),
    };

    return currentMetrics.current;
  };

  return (
    <AudioVisualizerContext.Provider
      value={{
        playlist,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        volume,
        isMuted,
        isFullscreenVisualizer,
        togglePlay,
        nextTrack,
        prevTrack,
        selectTrack,
        setVolume,
        toggleMute,
        toggleFullscreenVisualizer,
        loadCustomTrack,
        getAudioMetrics,
      }}
    >
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onEnded={nextTrack}
        preload="metadata"
      />
      {children}
    </AudioVisualizerContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioVisualizerContext);
  if (!ctx) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return ctx;
}
