"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function ShaderHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use alpha: true if you want to see the body background behind the shader
    // Use premultipliedAlpha: false to ensure colors don't wash out
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false
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
        // Reduced from 7 to 4 octaves for significantly better performance
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
        
        // Parallax
        p.y += u_scroll * 0.4;

        vec2 m = (u_mouse - 0.5) * 2.0;
        m.x *= aspect;

        float dist = distance(p, m);

        float ripple = sin(dist * 15.0 - u_time * 4.0) * 0.04 * u_click;
        float mouseWarp = smoothstep(1.2, 0.0, dist) * 0.2;
        vec2 warpedP = p + (p - m) * (mouseWarp + ripple);

        float v1 = ridgedFBM(warpedP * 1.2, 0.1);
        float v2 = ridgedFBM(warpedP * 2.5 + v1, 0.2);
        float v3 = ridgedFBM(warpedP * 5.0 - v2, 0.3);

        vec3 color = vec3(0.0);
        
        if (u_lightMode > 0.5) {
          // LIGHT MODE RENDER
          color += l_base;
          color = mix(color, l_indigo200, pow(v1, 1.5) * 0.8);
          color = mix(color, l_indigo400, pow(v2, 2.0) * 0.6);
          color = mix(color, l_indigo500, pow(v3, 3.0) * 0.4);
          
          // Light Mode Flare
          float flareStrength = 0.015 / (dist + 0.05);
          color += vec3(flareStrength) * l_indigo500;
          
          // Light Mode Edges (softest fade)
          color *= smoothstep(2.5, 0.5, length(p * 0.5) * 0.8);
        } else {
          // DARK MODE RENDER
          color += d_indigo950 * pow(v1, 2.0);
          color += d_indigo700 * pow(v2, 4.0) * 1.5;
          color += d_indigo500 * pow(v3, 6.0) * 3.0;

          // Dark Flare with Chromatic Aberration
          float flareR = 0.025 / (distance(p, m) + 0.05);
          float flareG = 0.025 / (distance(p, m + 0.01) + 0.05);
          float flareB = 0.025 / (distance(p, m - 0.01) + 0.05);
          vec3 flare = vec3(flareR, flareG, flareB) * d_indigo300;
          
          color += flare * (0.6 + v3 * 0.4);

          // Dark Mode Edges
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

    const resize = () => {
      // Limit DPR to 1.5 for background shader performance
      // Since it's blurry, high resolutions are unnecessary and expensive
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (t: number) => {
      clickAnim *= 0.95;
      gl.uniform1f(timeLoc, t * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseX, mouseY);
      gl.uniform1f(clickLoc, clickAnim);
      gl.uniform1f(scrollLoc, scrollY);
      gl.uniform1f(lightModeLoc, themeRef.current === 'light' ? 1.0 : 0.0);

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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Ensure this is lower than your content's z-index
        pointerEvents: 'none',
        background: 'transparent',
        transform: 'translateZ(0)', // Force hardware acceleration to prevent visual artifacts
      }}
    />
  );
}