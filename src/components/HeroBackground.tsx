"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useAudio } from "@/context/AudioContext";

interface ShaderBackgroundProps {
  className?: string;
  isCover?: boolean;
}

export default function ShaderHeroBackground({ className, isCover = false }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  const { getAudioMetrics } = useAudio();
  const audioMetricsRef = useRef(getAudioMetrics);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    audioMetricsRef.current = getAudioMetrics;
  }, [getAudioMetrics]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    let animationFrameId: number;
    let scrollY = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let clickAnim = 0;

    const vertexShaderSrc = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_click;
      uniform float u_scroll;
      uniform float u_lightMode;

      // Real-time Web Audio uniforms
      uniform float u_audioBass;
      uniform float u_audioMid;
      uniform float u_audioTreble;
      uniform float u_audioEnergy;

      // Dark Mode Colors
      const vec3 d_indigo950 = vec3(0.117, 0.105, 0.294);
      const vec3 d_indigo700 = vec3(0.258, 0.231, 0.722);
      const vec3 d_indigo500 = vec3(0.388, 0.400, 0.945);
      const vec3 d_indigo300 = vec3(0.647, 0.706, 0.973);

      // Light Mode Colors (Soft, bright airy pastels)
      const vec3 l_base = vec3(0.96, 0.97, 1.0);     // Very light blue/white
      const vec3 l_indigo200 = vec3(0.78, 0.82, 0.98); // Soft indigo
      const vec3 l_indigo400 = vec3(0.5, 0.57, 0.94);  // Mid indigo
      const vec3 l_indigo500 = vec3(0.388, 0.400, 0.945);

      // Optimized rotation matrix for rot(0.5)
      const mat2 m = mat2(0.87758, -0.47942, 0.47942, 0.87758);

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float ridgedFBM(vec2 p, float speed) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        float t = u_time * speed;
        for (int i = 0; i < 4; i++) {
          float n = noise(p + t);
          v += a * (1.0 - abs(n * 2.0 - 1.0));
          p = m * p * 2.2 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = (uv - 0.5) * 2.0;
        p.x *= aspect;
        
        vec2 screenP = p;
        p.y += u_scroll * 0.4;

        vec2 m = (u_mouse - 0.5) * 2.0;
        m.x *= aspect;

        // Decouple center of screen from mouse:
        // The core ambient glow and music breathing lives at the center of the viewport
        float centerDist = length(screenP);
        float mouseDist = distance(screenP, m);

        // Subtle local mouse interaction (completely unchanged from original)
        float ripple = sin(mouseDist * 15.0 - u_time * 4.0) * 0.04 * u_click;
        float mouseWarp = smoothstep(1.0, 0.0, mouseDist) * 0.12;

        vec2 baseP = p + (screenP - m) * (mouseWarp + ripple);

        // Natural fluid curl & swirl displacement (like dye in water or aurora borealis, NOT an explosion)
        vec2 fluidSwirl = vec2(
          sin(baseP.y * 1.8 + u_time * 0.3),
          cos(baseP.x * 1.8 + u_time * 0.3)
        ) * (u_audioBass * 0.14);

        vec2 warpedP = baseP + fluidSwirl;

        // Domain warping with music-enhanced folding:
        // Bass adds gentle depth to the primary wave
        float v1 = ridgedFBM(warpedP * 1.2, 0.10 + u_audioBass * 0.04);

        // Mids cause fluid smoke filaments to curl and twist deeper into each other
        float curlMod = 1.0 + u_audioMid * 0.35;
        float v2 = ridgedFBM(warpedP * 2.5 + v1 * curlMod, 0.20 + u_audioMid * 0.05);

        // Treble adds fine, crisp filament detail
        float v3 = ridgedFBM(warpedP * 5.0 - v2 * (1.0 + u_audioTreble * 0.25), 0.30);

        vec3 color = vec3(0.0);

        // Calm, soft ambient vignette (never blinding, zero supernova effect)
        float centerAura = (0.018 + u_audioEnergy * 0.015) / (centerDist * 0.85 + 0.16);
        
        if (u_lightMode > 0.5) {
          // LIGHT MODE: Soft, rich indigo clouds
          color += l_base;
          color = mix(color, l_indigo200, pow(v1, 1.5) * (0.8 + u_audioBass * 0.2));
          color = mix(color, l_indigo400, pow(v2, 2.0) * (0.6 + u_audioMid * 0.25));
          color = mix(color, l_indigo500, pow(v3, 3.0) * (0.4 + u_audioTreble * 0.3));
          
          color += vec3(centerAura * 0.5) * l_indigo500;
          color *= smoothstep(2.5, 0.5, length(p * 0.5) * 0.8);
        } else {
          // DARK MODE: Deep glowing indigo nebulae that swirl and fold organically with the sound
          color += d_indigo950 * pow(v1, 2.0) * (1.0 + u_audioBass * 0.35);
          color += d_indigo700 * pow(v2, 3.8) * (1.5 + u_audioMid * 0.45);
          color += d_indigo500 * pow(v3, 5.5) * (3.0 + u_audioTreble * 0.7);

          // Calm chromatic ambient aura
          float ca = 0.008;
          float auraR = centerAura;
          float auraG = (0.018 + u_audioEnergy * 0.015) / (length(screenP + ca) * 0.85 + 0.16);
          float auraB = (0.018 + u_audioEnergy * 0.015) / (length(screenP - ca) * 0.85 + 0.16);
          vec3 centralGlow = vec3(auraR, auraG, auraB) * d_indigo300 * (1.0 + u_audioEnergy * 0.25);
          
          color += centralGlow * (0.6 + v3 * 0.4);
          color *= smoothstep(2.2, 0.3, length(p * 0.5));
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader Error:", gl.getShaderInfoLog(sh));
      }
      return sh;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShaderSrc));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShaderSrc));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const clickLoc = gl.getUniformLocation(program, "u_click");
    const scrollLoc = gl.getUniformLocation(program, "u_scroll");
    const lightModeLoc = gl.getUniformLocation(program, "u_lightMode");

    const audioBassLoc = gl.getUniformLocation(program, "u_audioBass");
    const audioMidLoc = gl.getUniformLocation(program, "u_audioMid");
    const audioTrebleLoc = gl.getUniformLocation(program, "u_audioTreble");
    const audioEnergyLoc = gl.getUniformLocation(program, "u_audioEnergy");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const render = (t: number) => {
      if (!isVisible && !isCover) {
        animationFrameId = 0;
        return;
      }

      clickAnim *= 0.95;
      const audio = audioMetricsRef.current ? audioMetricsRef.current() : { bass: 0, mid: 0, treble: 0, energy: 0 };

      gl.uniform1f(timeLoc, t * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseX, mouseY);
      gl.uniform1f(clickLoc, clickAnim);
      gl.uniform1f(scrollLoc, scrollY);
      gl.uniform1f(lightModeLoc, themeRef.current === 'light' ? 1.0 : 0.0);

      gl.uniform1f(audioBassLoc, audio.bass);
      gl.uniform1f(audioMidLoc, audio.mid);
      gl.uniform1f(audioTrebleLoc, audio.treble);
      gl.uniform1f(audioEnergyLoc, audio.energy);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - (e.clientY / window.innerHeight);
    };
    const onMouseDown = () => (clickAnim = 1.0);
    const onScroll = () => {
      scrollY = window.scrollY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", resize);

    resize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [isCover]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`${isCover ? "fixed inset-0 w-screen h-screen" : "absolute inset-0 w-full h-full"} pointer-events-none z-0 ${className || ""}`}
      style={{
        background: 'transparent',
        transform: 'translateZ(0)',
      }}
    />
  );
}