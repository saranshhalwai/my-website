"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Disc3,
  Info,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Upload,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AudioProvider, useAudio } from "@/context/AudioContext";
import ShaderField from "./ShaderField";
import MotionDirector from "./MotionDirector";

const timestamp = (value: number) =>
  `${Math.floor(value / 60)}:${Math.floor(value % 60)
    .toString()
    .padStart(2, "0")}`;

function Equalizer() {
  const ref = useRef<HTMLDivElement>(null);
  const { isPlaying, getAudioMetrics } = useAudio();
  const metricsRef = useRef(getAudioMetrics);
  useEffect(() => {
    metricsRef.current = getAudioMetrics;
  }, [getAudioMetrics]);
  useEffect(() => {
    const bars = ref.current?.querySelectorAll<HTMLElement>("span");
    if (!bars) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const animate = () => {
      const audio = metricsRef.current();
      const bands = [
        audio.treble,
        audio.mid,
        audio.bass,
        audio.energy,
        audio.bass,
        audio.mid,
        audio.treble,
      ];
      bars.forEach((bar, i) => {
        bar.style.transform = `scaleY(${isPlaying ? Math.max(0.12, bands[i]) : 0.12})`;
      });
      if (isPlaying && !reduced.matches && !document.hidden)
        frame = requestAnimationFrame(animate);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      animate();
    };
    animate();
    document.addEventListener("visibilitychange", resume);
    reduced.addEventListener("change", resume);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", resume);
      reduced.removeEventListener("change", resume);
    };
  }, [isPlaying]);
  return (
    <div ref={ref} className="audio-equalizer" aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

function MusicPlayer() {
  const audio = useAudio();
  const [expanded, setExpanded] = useState(false);
  const [credits, setCredits] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  return (
    <aside
      className={`music-dock ${expanded ? "is-expanded" : ""}`}
      aria-label="Music player"
      data-playing={audio.isPlaying}
    >
      <input
        type="file"
        accept="audio/*"
        ref={file}
        className="audio-upload-input"
        aria-label="Upload custom audio"
        onChange={(event) => {
          const track = event.target.files?.[0];
          if (track) audio.loadCustomTrack(track);
          event.target.value = "";
        }}
      />
      <div className="music-compact">
        <button
          className="record-button"
          aria-label={audio.isPlaying ? "Pause" : "Play"}
          onClick={() => void audio.togglePlay()}
        >
          <Disc3
            size={34}
            className={audio.isPlaying ? "record-spinning" : ""}
          />
          <span>
            {audio.isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </span>
        </button>
        <button
          className="music-track"
          aria-label={expanded ? "Minimize music player" : "Open music player"}
          aria-expanded={expanded}
          aria-controls="music-controls"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="music-caption">
            {audio.isPlaying ? "NOW PLAYING" : "SOUND ON YOUR TERMS"}
          </span>
          <strong>{audio.currentTrack.title}</strong>
          <span>{audio.currentTrack.artist}</span>
        </button>
        <Equalizer />
        <button
          className="audio-icon"
          aria-label="Full-screen audio visualizer"
          onClick={() => audio.setVisualizerOpen(true)}
        >
          <Maximize2 size={16} />
        </button>
        <button
          className="audio-icon"
          aria-label={expanded ? "Minimize player" : "Expand player"}
          aria-expanded={expanded}
          aria-controls="music-controls"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
        </button>
      </div>
      {expanded && (
        <div className="music-controls" id="music-controls">
          <div className="audio-seek">
            <span>{timestamp(audio.progress)}</span>
            <input
              type="range"
              aria-label="Seek track"
              min="0"
              max={audio.duration || 1}
              value={Math.min(audio.progress, audio.duration || 1)}
              step="0.1"
              disabled={!audio.duration}
              onChange={(event) => audio.seek(Number(event.target.value))}
            />
            <span>{timestamp(audio.duration)}</span>
          </div>
          <div className="audio-buttons">
            <div>
              <button
                className="audio-icon"
                aria-label="Previous track"
                onClick={audio.prevTrack}
              >
                <SkipBack size={17} />
              </button>
              <button
                className="audio-play"
                aria-label={
                  audio.isPlaying ? "Pause playback" : "Start playback"
                }
                onClick={() => void audio.togglePlay()}
              >
                {audio.isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                className="audio-icon"
                aria-label="Next track"
                onClick={audio.nextTrack}
              >
                <SkipForward size={17} />
              </button>
            </div>
            <div className="audio-volume">
              <button
                className="audio-icon"
                aria-label={audio.isMuted ? "Unmute" : "Mute"}
                onClick={audio.toggleMute}
              >
                {audio.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                aria-label="Volume"
                min="0"
                max="1"
                step=".01"
                value={audio.isMuted ? 0 : audio.volume}
                onChange={(event) =>
                  audio.setVolume(Number(event.target.value))
                }
              />
            </div>
            <div>
              <button
                className="audio-icon"
                aria-label="Upload custom MP3"
                onClick={() => file.current?.click()}
              >
                <Upload size={16} />
              </button>
              <button
                className="audio-icon"
                aria-label="Track attribution and license"
                aria-expanded={credits}
                onClick={() => setCredits(!credits)}
              >
                <Info size={16} />
              </button>
            </div>
          </div>
          <div className="audio-playlist" aria-label="Playlist">
            {audio.playlist.map((track, index) => (
              <button
                key={track.id}
                aria-pressed={audio.currentTrackIndex === index}
                onClick={() => audio.selectTrack(index)}
              >
                <span>0{index + 1}</span>
                {track.title}
                {audio.currentTrackIndex === index && (
                  <span className="playlist-dot" />
                )}
              </button>
            ))}
          </div>
          {credits && (
            <div className="audio-credits">
              <strong>Track Attribution &amp; License</strong>
              <p>{audio.currentTrack.attribution.song}</p>
              <p>Provided by: {audio.currentTrack.attribution.provider}</p>
              {audio.currentTrack.attribution.downloadUrl && (
                <a
                  href={audio.currentTrack.attribution.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Free Download/Stream ↗
                </a>
              )}
              {audio.currentTrack.attribution.watchUrl && (
                <a
                  href={audio.currentTrack.attribution.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video ↗
                </a>
              )}
            </div>
          )}
        </div>
      )}
      {audio.error && (
        <p className="audio-error" role="status">
          {audio.error}
        </p>
      )}
    </aside>
  );
}

function FullscreenVisualizer() {
  const audio = useAudio();
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const setOpen = useRef(audio.setVisualizerOpen);
  useEffect(() => {
    setOpen.current = audio.setVisualizerOpen;
  }, [audio.setVisualizerOpen]);
  useEffect(() => {
    if (!audio.visualizerOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const page = document.getElementById("portfolio-content");
    const dock = document.querySelector<HTMLElement>(".music-dock");
    document.body.style.overflow = "hidden";
    if (page) page.inert = true;
    if (dock) dock.inert = true;
    close.current?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen.current(false);
      }
      if (event.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>(
          "button,a[href],input",
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keys);
    return () => {
      document.body.style.overflow = overflow;
      if (page) page.inert = false;
      if (dock) dock.inert = false;
      document.removeEventListener("keydown", keys);
      previous?.focus();
    };
  }, [audio.visualizerOpen]);
  if (!audio.visualizerOpen) return null;
  return (
    <div
      className="fullscreen-visualizer"
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="visualizer-title"
    >
      <ShaderField immersive />
      <div className="visualizer-top">
        <div>
          <span className="visualizer-caption">
            AUDIO VISUALIZER / SOUND IN MOTION
          </span>
          <h2 id="visualizer-title">{audio.currentTrack.title}</h2>
          <p>{audio.currentTrack.artist}</p>
          <span className="visualizer-credit">
            {audio.currentTrack.attribution.song} ·{" "}
            {audio.currentTrack.attribution.provider}
          </span>
        </div>
        <button
          className="visualizer-close"
          aria-label="Exit visualizer"
          ref={close}
          onClick={() => audio.setVisualizerOpen(false)}
        >
          <X size={22} />
          <span>ESC</span>
        </button>
      </div>
      <div className="visualizer-bottom">
        <span className="visualizer-hint">
          MOVE YOUR CURSOR. FEEL THE FREQUENCIES.
        </span>
        <div className="visualizer-playback">
          <button aria-label="Previous track" onClick={audio.prevTrack}>
            <SkipBack size={22} />
          </button>
          <button
            className="audio-play"
            aria-label={audio.isPlaying ? "Pause playback" : "Start playback"}
            onClick={() => void audio.togglePlay()}
          >
            {audio.isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button aria-label="Next track" onClick={audio.nextTrack}>
            <SkipForward size={22} />
          </button>
        </div>
        <button
          className="visualizer-exit"
          onClick={() => audio.setVisualizerOpen(false)}
        >
          Back to portfolio <Minimize2 size={15} />
        </button>
        {audio.error && (
          <p role="status" className="audio-error">
            {audio.error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function MusicExperience({ children }: { children: ReactNode }) {
  return (
    <AudioProvider>
      <div id="portfolio-content">{children}</div>
      <MotionDirector />
      <MusicPlayer />
      <FullscreenVisualizer />
    </AudioProvider>
  );
}
