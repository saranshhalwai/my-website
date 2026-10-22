"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

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
interface AudioState {
  playlist: Track[];
  currentTrack: Track;
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  error: string | null;
  progress: number;
  duration: number;
  visualizerOpen: boolean;
  togglePlay: () => Promise<void>;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  seek: (value: number) => void;
  setVisualizerOpen: (open: boolean) => void;
  loadCustomTrack: (file: File) => void;
  getAudioMetrics: () => AudioMetrics;
}
const Context = createContext<AudioState | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [playlist, setPlaylist] = useState<Track[]>(PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [visualizerOpen, setVisualizerOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const context = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const data = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const metrics = useRef<AudioMetrics>({
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
  });
  const wantsPlayback = useRef(false);
  const uploads = useRef<string[]>([]);
  const currentTrack = playlist[currentTrackIndex];

  async function prepareAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!context.current && window.AudioContext) {
      const ctx = new window.AudioContext();
      const node = ctx.createAnalyser();
      node.fftSize = 512;
      node.smoothingTimeConstant = 0.78;
      ctx.createMediaElementSource(audio).connect(node);
      node.connect(ctx.destination);
      context.current = ctx;
      analyser.current = node;
      data.current = new Uint8Array(node.frequencyBinCount);
    }
    if (context.current?.state === "suspended") await context.current.resume();
  }

  async function play() {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    wantsPlayback.current = true;
    try {
      await prepareAudio();
      await audio.play();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      wantsPlayback.current = false;
      setIsPlaying(false);
      setError(
        "Couldn’t play this track. Try another track or upload your own.",
      );
    }
  }

  async function togglePlay() {
    if (!audioRef.current) return;
    if (!audioRef.current.paused) {
      wantsPlayback.current = false;
      audioRef.current.pause();
    } else await play();
  }

  function selectTrack(index: number) {
    if (index < 0 || index >= playlist.length) return;
    if (index === currentTrackIndex) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      void play();
    } else {
      // Resume the context in the same user gesture, including on mobile Safari.
      void prepareAudio().catch(() => {});
      wantsPlayback.current = true;
      setCurrentTrackIndex(index);
    }
  }
  function nextTrack() {
    selectTrack((currentTrackIndex + 1) % playlist.length);
  }
  function prevTrack() {
    selectTrack((currentTrackIndex - 1 + playlist.length) % playlist.length);
  }
  function setVolume(value: number) {
    const next = Math.max(0, Math.min(1, value));
    setVolumeState(next);
    if (next > 0) setIsMuted(false);
  }
  function seek(value: number) {
    if (audioRef.current && Number.isFinite(duration) && duration > 0) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, value));
      setProgress(audioRef.current.currentTime);
    }
  }
  function loadCustomTrack(file: File) {
    if (
      !file.type.startsWith("audio/") &&
      !/\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(file.name)
    ) {
      setError("Choose an audio file.");
      return;
    }
    const url = URL.createObjectURL(file);
    uploads.current.push(url);
    void prepareAudio().catch(() => {});
    setPlaylist([
      ...playlist,
      {
        id: `upload-${uploads.current.length}`,
        title: file.name.replace(/\.[^.]+$/, ""),
        artist: "Local Upload",
        src: url,
        attribution: { song: file.name, provider: "Uploaded by User" },
      },
    ]);
    wantsPlayback.current = true;
    setCurrentTrackIndex(playlist.length);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let active = true;
    audio.src = currentTrack.src;
    audio.load();
    const start = async () => {
      if (!wantsPlayback.current) return;
      try {
        await audio.play();
      } catch (err) {
        if (
          !active ||
          (err instanceof DOMException && err.name === "AbortError")
        )
          return;
        wantsPlayback.current = false;
        setIsPlaying(false);
        setError(
          "Couldn’t play this track. Try another track or upload your own.",
        );
      }
    };
    void start();
    return () => {
      active = false;
    };
  }, [currentTrack.src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);
  useEffect(
    () => () => {
      uploads.current.forEach((url) => URL.revokeObjectURL(url));
      void context.current?.close();
    },
    [],
  );

  function getAudioMetrics() {
    const node = analyser.current;
    const bins = data.current;
    const audio = audioRef.current;
    if (!node || !bins || !audio || audio.paused) {
      for (const key of ["bass", "mid", "treble", "energy"] as const)
        metrics.current[key] *= 0.88;
      return metrics.current;
    }
    node.getByteFrequencyData(bins);
    const average = (from: number, to: number) => {
      let total = 0;
      for (let i = from; i < to; i++) total += bins[i];
      return Math.min(1, (total / ((to - from) * 255)) * 1.65);
    };
    // Derive bands from sample rate rather than assuming fixed FFT-bin frequencies.
    const binHz = (context.current?.sampleRate ?? 48000) / node.fftSize;
    const cutoff = (hz: number) =>
      Math.max(1, Math.min(bins.length, Math.round(hz / binHz)));
    const bassEnd = Math.max(2, cutoff(250));
    const midEnd = Math.max(bassEnd + 1, cutoff(2500));
    const trebleEnd = Math.max(midEnd + 1, cutoff(10000));
    const target = {
      bass: average(1, bassEnd),
      mid: average(bassEnd, midEnd),
      treble: average(midEnd, trebleEnd),
      energy: average(1, bins.length),
    };
    for (const key of ["bass", "mid", "treble", "energy"] as const) {
      const speed = target[key] > metrics.current[key] ? 0.3 : 0.09;
      metrics.current[key] += (target[key] - metrics.current[key]) * speed;
    }
    return metrics.current;
  }

  return (
    <Context.Provider
      value={{
        playlist,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        volume,
        isMuted,
        error,
        progress,
        duration,
        visualizerOpen,
        togglePlay,
        nextTrack,
        prevTrack,
        selectTrack,
        setVolume,
        toggleMute: () => setIsMuted((value) => !value),
        seek,
        setVisualizerOpen,
        loadCustomTrack,
        getAudioMetrics,
      }}
    >
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => {
          setIsPlaying(true);
          setError(null);
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => {
          setDuration(
            Number.isFinite(audioRef.current?.duration)
              ? audioRef.current!.duration
              : 0,
          );
          setProgress(0);
        }}
        onEnded={nextTrack}
        onError={() => {
          setIsPlaying(false);
          setError(
            "This track couldn’t load. Try another track or upload your own.",
          );
        }}
      />
      {children}
    </Context.Provider>
  );
}
export function useAudio() {
  const value = useContext(Context);
  if (!value) throw new Error("useAudio requires AudioProvider");
  return value;
}
