"use client";

import { useEffect, useRef } from "react";

export default function ShaderHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    let timeLoc: WebGLUniformLocation | null;
    let resLoc: WebGLUniformLocation | null;
    let mouseLoc: WebGLUniformLocation | null;
    let clickLoc: WebGLUniformLocation | null;

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

      vec3 indigo950 = vec3(0.117, 0.105, 0.294);
      vec3 indigo700 = vec3(0.258, 0.231, 0.722);
      vec3 indigo500 = vec3(0.388, 0.400, 0.945);
      vec3 indigo300 = vec3(0.647, 0.706, 0.973);

      mat2 rot(float a) {
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
      }

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
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
        for (int i = 0; i < 7; i++) {
          float n = noise(p + u_time * speed);
          v += a * (1.0 - abs(n * 2.0 - 1.0));
          p = rot(0.5) * p * 2.2 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = (uv - 0.5) * 2.0;
        p.x *= aspect;

        vec2 m = (u_mouse - 0.5) * 2.0;
        m.x *= aspect;

        float dist = distance(p, m);

        float ripple = sin(dist * 15.0 - u_time * 4.0) * 0.04 * u_click;
        float mouseWarp = smoothstep(1.0, 0.0, dist) * 0.3;
        vec2 warpedP = p + (p - m) * (mouseWarp + ripple);

        float v1 = ridgedFBM(warpedP * 1.2, 0.1);
        float v2 = ridgedFBM(warpedP * 2.5 + v1, 0.25);
        float v3 = ridgedFBM(warpedP * 5.0 - v2, 0.4);

        vec3 color = vec3(0.0);
        color += indigo950 * pow(v1, 2.0);
        color += indigo700 * pow(v2, 4.0) * 1.5;
        color += indigo500 * pow(v3, 6.0) * 3.0;

        float flare = 0.02 / (dist + 0.04);
        color += indigo300 * flare * (1.0 + v3);

        color *= smoothstep(1.6, 0.4, length(p * 0.45));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
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
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    timeLoc = gl.getUniformLocation(program, "u_time");
    resLoc = gl.getUniformLocation(program, "u_resolution");
    mouseLoc = gl.getUniformLocation(program, "u_mouse");
    clickLoc = gl.getUniformLocation(program, "u_click");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (t: number) => {
      clickAnim *= 0.95;
      gl.uniform1f(timeLoc, t * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseX, mouseY);
      gl.uniform1f(clickLoc, clickAnim);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", e => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
    });

    window.addEventListener("mousedown", () => (clickAnim = 1));
    window.addEventListener("resize", resize);

    resize();
    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
      <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none"
      />
  );
}
