import { useEffect, useRef } from "react";
import { getFFT } from "../../audio/analyser";

export default function CanvasVisualizer() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    let animationId;
    function draw() {
      animationId = requestAnimationFrame(draw);
      const fft = getFFT();
      if (!fft || !fft.length) return;

      ctx.fillStyle = "rgba(6, 8, 14, 0.65)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / fft.length;
      fft.forEach((v, i) => {
        const height = Math.max(0, (v + 140) * 1.5);
        ctx.fillStyle = `hsla(${i * 3}, 80%, 60%, 0.55)`;
        const x = i * barWidth;
        ctx.fillRect(x, canvas.height - height, barWidth * 0.9, height);
      });
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} />;
}
