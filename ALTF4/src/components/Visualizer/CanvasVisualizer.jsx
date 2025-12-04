import { useEffect, useRef } from "react";
import { getFFT } from "../../audio/analyser";

export default function CanvasVisualizer() {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    function draw() {
      requestAnimationFrame(draw);
      const fft = getFFT();

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fft.forEach((v, i) => {
        const height = (v + 140) * 2;
        ctx.fillStyle = `hsl(${i * 5}, 80%, 60%)`;
        ctx.fillRect(i * 10, canvas.height - height, 9, height);
      });
    }
    draw();
  }, []);

  return <canvas ref={ref} width={800} height={250} />;
}
