'use client';

import { useEffect, useRef } from 'react';
import { fragmentShader } from './source-shader';

const palettes = [
  ['#dfe9a6', '#6fb389', '#cf9a5c'],
  ['#cfe0fb', '#5b8def', '#2f5fb0'],
  ['#b9f0d8', '#34c98a', '#0f9468'],
  ['#fde4c4', '#f6a86a', '#e0824a'],
];

export function SourceGradient({ variant }: { variant: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) return;
    function compile(type: number, source: string) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
    const vertex = compile(
      gl.VERTEX_SHADER,
      '#version 300 es\nin vec2 position; void main(){ gl_Position=vec4(position,0.0,1.0); }',
    );
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();
    const releaseProgram = () => {
      if (program) gl.deleteProgram(program);
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
    };
    if (!vertex || !fragment || !program) {
      releaseProgram();
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      releaseProgram();
      return;
    }
    const activateProgram = gl.useProgram.bind(gl);
    activateProgram(program);
    const buffer = gl.createBuffer();
    if (!buffer) {
      releaseProgram();
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = {
      uTimeSpeed: 0.25,
      uColorBalance: 0,
      uWarpStrength: 1,
      uWarpFrequency: 5,
      uWarpSpeed: 2,
      uWarpAmplitude: 50,
      uBlendAngle: 0,
      uBlendSoftness: 0.05,
      uRotationAmount: 500,
      uNoiseScale: 2,
      uGrainAmount: variant === 0 ? 0.1 : 0.08,
      uGrainScale: 2,
      uGrainAnimated: 0,
      uContrast: variant === 0 ? 1.25 : 1.2,
      uGamma: 1,
      uSaturation: 1,
      uZoom: variant === 0 ? 0.8 : 0.9,
    };
    Object.entries(uniforms).forEach(([key, value]) =>
      gl.uniform1f(gl.getUniformLocation(program, key), value),
    );
    gl.uniform2f(gl.getUniformLocation(program, 'uCenterOffset'), 0, 0);
    (palettes[variant] ?? palettes[0]).forEach((hex, index) => {
      gl.uniform3f(
        gl.getUniformLocation(program, `uColor${index + 1}`),
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
      );
    });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = true;
    const started = performance.now();
    function draw(time: number) {
      if (!gl || !canvas || !program) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(
        gl.getUniformLocation(program, 'iResolution'),
        width,
        height,
      );
      gl.uniform1f(
        gl.getUniformLocation(program, 'iTime'),
        reduced.matches ? 0 : (time - started) / 1000,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.style.opacity = '1';
      frame = 0;
      if (visible && !document.hidden && !reduced.matches)
        frame = requestAnimationFrame(draw);
    }
    const start = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(canvas);
    const resize = new ResizeObserver(start);
    resize.observe(canvas);
    const visibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', start);
    start();
    return () => {
      stop();
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', start);
      gl.deleteBuffer(buffer);
      releaseProgram();
    };
  }, [variant]);
  return (
    <div
      className="source-gradient"
      style={{
        background: 'linear-gradient(135deg, #35433d, #555244, #292d30)',
      }}
      aria-hidden="true"
    >
      <canvas ref={ref} style={{ width: '100%', height: '100%', opacity: 0 }} />
    </div>
  );
}
