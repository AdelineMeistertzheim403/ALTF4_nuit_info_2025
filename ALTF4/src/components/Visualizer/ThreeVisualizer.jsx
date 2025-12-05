import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getFFT } from "../../audio/analyser";

export default function ThreeVisualizer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const palette = {
      deep: new THREE.Color(0x050912),
      sky: new THREE.Color(0x5aa8ff),
      aqua: new THREE.Color(0x47ffd6),
      lime: new THREE.Color(0x89ff62),
    };
    scene.fog = new THREE.FogExp2(palette.deep, 0.1);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 0.6, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xbad6ff, 0.55));
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(0, 2.5, 6);
    scene.add(dir);

    const group = new THREE.Group();
    scene.add(group);

    // Vortex d’anneaux
    const rings = [];
    const ringCount = 18;
    for (let i = 0; i < ringCount; i++) {
      const radius = 0.8 + i * 0.18;
      const geom = new THREE.TorusGeometry(radius, 0.05, 12, 96);
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? palette.sky : palette.aqua,
        emissive: palette.deep,
        emissiveIntensity: 0.35,
        metalness: 0.25,
        roughness: 0.3,
        transparent: true,
        opacity: 0.4,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.z = -i * 0.35;
      rings.push(mesh);
      group.add(mesh);
    }

    // Spiral de particules qui fonce vers la caméra
    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 3.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = -Math.random() * 18 - 2;
      speeds[i] = 0.06 + Math.random() * 0.08;
    }
    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: palette.sky,
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particlesGeom, particlesMat);
    group.add(particles);

    // Tube lumineux central
    const tubeGeom = new THREE.CylinderGeometry(0.16, 0.16, 10, 28, 1, true);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: palette.lime,
      emissive: palette.aqua,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const tube = new THREE.Mesh(tubeGeom, tubeMat);
    tube.position.z = -4.5;
    group.add(tube);

    const clock = new THREE.Clock();
    let nextPalette = clock.getElapsedTime() + 6;

    function randomPalette() {
      const baseHue = Math.random();
      const sky = new THREE.Color().setHSL(baseHue, 0.75, 0.62);
      const aqua = new THREE.Color().setHSL((baseHue + 0.12) % 1, 0.85, 0.65);
      const lime = new THREE.Color().setHSL((baseHue + 0.28) % 1, 0.85, 0.62);
      palette.sky.copy(sky);
      palette.aqua.copy(aqua);
      palette.lime.copy(lime);

      rings.forEach((ring, i) => {
        ring.material.color.copy(i % 2 === 0 ? palette.sky : palette.aqua);
      });
      particles.material.color.copy(palette.sky);
      tube.material.color.copy(palette.lime);
      tube.material.emissive.copy(palette.aqua);
    }

    randomPalette();
    let animationId;

    function resize() {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
    window.addEventListener("resize", resize);
    resize();

    function animate() {
      animationId = requestAnimationFrame(animate);
      const fft = getFFT();
      const bass = fft?.[2] ?? -140;
      const mid = fft?.[16] ?? -140;
      const treble = fft?.[32] ?? -140;
      const bassLevel = Math.max(0, (bass + 120) / 30);
      const midLevel = Math.max(0, (mid + 120) / 30);
      const trebleLevel = Math.max(0, (treble + 120) / 30);

      const t = clock.getElapsedTime();

      if (t >= nextPalette) {
        randomPalette();
        nextPalette = t + 5 + Math.random() * 5;
      }

      // Anneaux en vortex
      rings.forEach((ring, i) => {
        const depthFactor = i / ringCount;
        const spin = 0.2 + depthFactor * 0.35 + bassLevel * 0.12;
        ring.rotation.z += spin * 0.012;
        const scale = 1 + midLevel * 0.45 + depthFactor * 0.12;
        ring.scale.setScalar(scale);
        ring.material.opacity = 0.2 + trebleLevel * 0.6;
        ring.material.emissiveIntensity = 0.25 + bassLevel * 0.6;
      });

      // Spirale de particules qui remonte vers la caméra
      const pos = particles.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let z = pos.getZ(i);
        z += speeds[i] * (1 + bassLevel * 0.6);
        if (z > 2) {
          z = -20 - Math.random() * 4;
        }
        pos.setZ(i, z);
        const angle = (z + t * 2.5) * 0.38;
        const radius = pos.getX(i) !== 0 || pos.getZ(i) !== 0 ? Math.sqrt(pos.getX(i) ** 2 + pos.getY(i) ** 2) : 1;
        pos.setX(i, Math.cos(angle) * radius);
        pos.setY(i, Math.sin(angle * 1.3) * 0.7 + Math.sin(angle) * 0.25);
      }
      pos.needsUpdate = true;
      particles.material.opacity = 0.35 + trebleLevel * 0.6;

      // Tube pulsant
      tube.scale.x = 1 + bassLevel * 0.7;
      tube.scale.z = 1 + bassLevel * 0.7;
      tube.material.opacity = 0.25 + midLevel * 0.6;

      group.rotation.y = Math.sin(t * 0.12) * 0.04;
      group.rotation.x = Math.cos(t * 0.05) * 0.03;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      container.removeChild(renderer.domElement);
      rings.forEach((r) => {
        r.geometry.dispose();
        r.material.dispose();
      });
      particlesGeom.dispose();
      particlesMat.dispose();
      tubeGeom.dispose();
      tubeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="visualizer-3d-canvas" />;
}
