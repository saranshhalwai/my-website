"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";

// A continuous, folded ribbon: geometry and its normals deform together.
const vertex = `
precision highp float;
attribute vec2 parameter;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_energy;
uniform float u_impulse;
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_tangent;
const float PI=3.14159265359;
mat3 turnY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 turnX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 turnZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
vec3 spine(float t){
 float radius=1.+.28*cos(3.*t+u_time*.12);
 return vec3(radius*cos(2.*t),radius*sin(2.*t),.49*sin(3.*t));
}
vec3 ribbon(float t,float v){
 vec3 center=spine(t);
 vec3 tangent=normalize(spine(t+.002)-spine(t-.002));
 vec3 side=normalize(cross(tangent,vec3(0.,0.,1.)));
 vec3 up=cross(side,tangent);
 float twist=3.*t+u_time*.13+sin(t*3.-u_time*.4)*(.14+u_mid*.12);
 twist+=u_impulse*.16*sin(t*4.-u_time*2.);
 vec3 wide=side*cos(twist)+up*sin(twist);
 vec3 narrow=-side*sin(twist)+up*cos(twist);
 float width=.22+u_bass*.055+sin(t*5.+u_time*.3)*.025;
 float thickness=.065+u_energy*.012;
 return center+wide*cos(v)*width+narrow*sin(v)*thickness;
}
void main(){
 float t=parameter.x*2.*PI,v=parameter.y*2.*PI;
 vec3 position=ribbon(t,v);
 vec3 du=ribbon(t+.001,v)-ribbon(t-.001,v);
 vec3 dv=ribbon(t,v+.001)-ribbon(t,v-.001);
 vec3 normal=normalize(cross(du,dv));
 mat3 rotation=turnZ(-.28)*turnY(.6+u_time*.12+(u_pointer.x-.5)*.38)*turnX(.42+(u_pointer.y-.5)*.3);
 position=rotation*position;
 v_position=position;
 v_normal=rotation*normal;
 v_tangent=normalize(rotation*du);
 float viewZ=position.z-4.7;
 float aspect=u_resolution.x/u_resolution.y;
 gl_Position=vec4(position.x*2.8/aspect,position.y*2.8,-1.020202*viewZ-.2020202,-viewZ);
}`;
const fragment = `
precision highp float;
uniform float u_immersive;
uniform float u_treble;
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_tangent;
void main(){
 vec3 normal=normalize(v_normal)*(gl_FrontFacing?1.:-1.);
 vec3 view=normalize(vec3(0.,0.,4.7)-v_position);
 vec3 key=normalize(vec3(-3.,4.,5.)-v_position);
 vec3 fill=normalize(vec3(4.,.5,2.)-v_position);
 vec3 halfVector=normalize(key+view);
 float diffuse=max(dot(normal,key),0.);
 float softFill=max(dot(normal,fill),0.);
 float facing=max(dot(normal,view),0.);
 float fresnel=pow(1.-facing,3.);
 float broad=pow(max(dot(normal,halfVector),0.),9.);
 float highlight=pow(max(dot(normal,halfVector),0.),65.);
 vec3 oxide=vec3(.29,.067,.035);
 vec3 copper=vec3(.67,.205,.105);
 vec3 champagne=vec3(.96,.79,.58);
 vec3 pigment=mix(oxide,copper,diffuse*.8+.15);
 vec3 color=pigment*(.36+diffuse*.85+softFill*.18);
 color+=champagne*(broad*.22+highlight*(.65+u_treble*.2));
 color+=vec3(.51,.29,.15)*fresnel*.35;
 color*=.83+.17*smoothstep(-1.2,1.2,v_position.y);
 color*=mix(1.,1.2,u_immersive);
 gl_FragColor=vec4(pow(color,vec3(.88)),1.);
}`;

export default function ShaderField({
  immersive = false,
}: {
  immersive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getAudioMetrics, visualizerOpen } = useAudio();
  const metricsRef = useRef(getAudioMetrics);
  const covered = useRef(false);
  useEffect(() => {
    metricsRef.current = getAudioMetrics;
    covered.current = visualizerOpen && !immersive;
  }, [getAudioMetrics, visualizerOpen, immersive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vert = compile(gl.VERTEX_SHADER, vertex),
      frag = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vert || !frag || !program) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      return;
    }
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
      return;
    }
    gl.useProgram(program);
    const segments = 256;
    const sides = 32;
    const parameters = new Float32Array((segments + 1) * (sides + 1) * 2);
    const indices = new Uint16Array(segments * sides * 6);
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= sides; j++) {
        const offset = (i * (sides + 1) + j) * 2;
        parameters[offset] = i / segments;
        parameters[offset + 1] = j / sides;
      }
    }
    let cursor = 0;
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < sides; j++) {
        const a = i * (sides + 1) + j,
          b = a + sides + 1;
        indices.set([a, b, a + 1, a + 1, b, b + 1], cursor);
        cursor += 6;
      }
    }
    const buffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, parameters, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "parameter");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    const uniforms = Object.fromEntries(
      [
        "resolution",
        "pointer",
        "time",
        "bass",
        "mid",
        "treble",
        "energy",
        "immersive",
        "impulse",
      ].map((name) => [name, gl.getUniformLocation(program, `u_${name}`)]),
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      visible = true,
      lost = false,
      last = 0,
      time = 0,
      impulse = 0;
    let pointerX = 0.5,
      pointerY = 0.5,
      targetX = 0.5,
      targetY = 0.5;
    function draw(now: number) {
      frame = 0;
      if (!gl || !canvas || lost) return;
      const active = visible && !document.hidden && !covered.current;
      const interval = window.innerWidth < 700 ? 1000 / 30 : 1000 / 60;
      if (active && (now - last >= interval || reduced.matches)) {
        time += reduced.matches ? 0 : Math.min((now - last) / 1000, 0.05);
        last = now;
        pointerX += (targetX - pointerX) * 0.06;
        pointerY += (targetY - pointerY) * 0.06;
        impulse *= 0.94;
        const audio = reduced.matches
          ? { bass: 0, mid: 0, treble: 0, energy: 0 }
          : metricsRef.current();
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        gl.uniform2f(uniforms.pointer, pointerX, pointerY);
        gl.uniform1f(uniforms.time, time);
        gl.uniform1f(uniforms.immersive, immersive ? 1 : 0);
        gl.uniform1f(uniforms.impulse, impulse);
        gl.uniform1f(uniforms.bass, audio.bass);
        gl.uniform1f(uniforms.mid, audio.mid);
        gl.uniform1f(uniforms.treble, audio.treble);
        gl.uniform1f(uniforms.energy, audio.energy);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        canvas.dataset.rendered = "true";
      }
      if (!reduced.matches && active) frame = requestAnimationFrame(draw);
    }
    const start = () => {
      if (!frame && !lost) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(
        window.devicePixelRatio,
        window.innerWidth < 700 ? 1 : 1.25,
      );
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      start();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    observer.observe(canvas);
    const sizing = new ResizeObserver(resize);
    sizing.observe(canvas);
    const move = (event: PointerEvent) => {
      if (reduced.matches) return;
      const bounds = canvas.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / bounds.width;
      targetY = 1 - (event.clientY - bounds.top) / bounds.height;
    };
    const press = () => {
      if (!reduced.matches) impulse = 1;
    };
    const onLoss = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      delete canvas.dataset.rendered;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("visibilitychange", start);
    reduced.addEventListener("change", start);
    // Opening or closing the full-screen view can cover a still-intersecting hero.
    const onViewChange = () => start();
    window.addEventListener("portfolio-visualizer", onViewChange);
    canvas.addEventListener("webglcontextlost", onLoss);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizing.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      document.removeEventListener("visibilitychange", start);
      reduced.removeEventListener("change", start);
      window.removeEventListener("portfolio-visualizer", onViewChange);
      canvas.removeEventListener("webglcontextlost", onLoss);
      gl.deleteBuffer(buffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
  }, [immersive]);
  useEffect(() => {
    window.dispatchEvent(new Event("portfolio-visualizer"));
  }, [visualizerOpen]);
  return (
    <canvas
      key="copper-ribbon"
      className={`shader-field ${immersive ? "shader-immersive" : ""}`}
      ref={canvasRef}
      aria-hidden="true"
    />
  );
}
