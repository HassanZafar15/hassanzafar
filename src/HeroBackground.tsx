import { useEffect, useRef, type RefObject } from "react";

const VERTEX_SHADER = `attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAGMENT_SHADER = `
precision highp float;
uniform float T;
uniform vec2 R;
uniform vec2 M;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<6;i++){v+=a*n(p);p*=2.02;a*=.48;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/R;
  uv.y=1.-uv.y;
  vec2 m=M/R;
  m.y=1.-m.y;
  float d=length(uv-m);
  float mfx=smoothstep(.45,0.,d)*.4;
  vec2 q=uv*3.+vec2(T*.1,T*.07);
  float f=fbm(q+fbm(q+fbm(q+mfx)));
  vec3 c1=vec3(.04,.05,.09);
  vec3 c2=vec3(.5,.12,.07);
  vec3 c3=vec3(.91,.36,.22);
  vec3 col=mix(mix(c1,c2,f*1.8),c3,max(0.,f*2.-1.));
  float vig=1.-length(uv-.5)*1.4;
  col*=clamp(vig,0.,1.);
  gl_FragColor=vec4(col,f*.9+.06);
}`;

const showFallback = (fallbackRef: RefObject<HTMLDivElement | null>) => {
  fallbackRef.current?.classList.add("visible");
};

export const HeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      showFallback(fallbackRef);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      showFallback(fallbackRef);
      return;
    }

    let frame = 0;
    let cleanup: (() => void) | undefined;

    try {
      const gl = canvas.getContext("webgl");
      if (!gl) {
        showFallback(fallbackRef);
        return;
      }

      const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vs || !fs) {
        showFallback(fallbackRef);
        return;
      }

      const program = gl.createProgram();
      if (!program) {
        showFallback(fallbackRef);
        return;
      }

      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        showFallback(fallbackRef);
        return;
      }

      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

      const positionLoc = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      const timeLoc = gl.getUniformLocation(program, "T");
      const resolutionLoc = gl.getUniformLocation(program, "R");
      const mouseLoc = gl.getUniformLocation(program, "M");

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      };

      resize();
      window.addEventListener("resize", resize);

      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };
      document.addEventListener("mousemove", onMouseMove);

      const start = Date.now();

      const draw = () => {
        if (!timeLoc || !resolutionLoc || !mouseLoc) return;
        gl.uniform1f(timeLoc, (Date.now() - start) * 0.001);
        gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
        gl.uniform2f(mouseLoc, mouseX, mouseY);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        frame = requestAnimationFrame(draw);
      };

      draw();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        document.removeEventListener("mousemove", onMouseMove);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
      };
    } catch {
      showFallback(fallbackRef);
    }

    return () => cleanup?.();
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="hero-wgl" aria-hidden="true" />
      <div ref={fallbackRef} className="hero-bg-glow hero-bg-fallback" aria-hidden="true" />
      <div className="hero-grid-lines" aria-hidden="true" />
    </>
  );
};
