import React, { useEffect, useRef } from "react";

interface TribologySimulationProps {
  load: number;          // 10 - 1000 N
  speed: number;         // 0.05 - 5 m/s
  roughness: number;     // 0.1 - 5 um
  lubrication: boolean;  // true/false
  stageIndex?: number;   // 0 to 6 for Learn Mode stages
  isPaused?: boolean;
}

export const AdhesiveWearSimulation: React.FC<TribologySimulationProps> = ({
  load,
  speed,
  roughness,
  lubrication,
  stageIndex = -1,
  isPaused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offsetX = 0;

    // Asperity debris particles array
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
      color: string;
    }
    const particles: Particle[] = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      // Contact normal loading displacement
      // Higher load pushes the upper specimen down into deeper asperity penetration
      const normalDeflection = (load / 1000) * 14;
      const topSurfaceBaselineY = midY - 35 + normalDeflection;
      const bottomSurfaceBaselineY = midY + 35;

      // 1. Draw Technical Grid & Coordinate Reference
      ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Generate Rough Asperity Heights
      // Amplitude scales with roughness (0.1 - 5 um)
      const asperityAmp = 6 + roughness * 4.5;
      const waveFreq = 0.045;

      // TOP SPECIMEN (SLIDING COUNTERFACE - Moving Left to Right)
      ctx.save();
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, topSurfaceBaselineY);

      // Draw top asperities (inverted, pointing down)
      for (let x = width; x >= 0; x -= 4) {
        const asperity = Math.sin((x + offsetX) * waveFreq) * asperityAmp +
                         Math.cos((x + offsetX) * waveFreq * 2.3) * (asperityAmp * 0.4);
        ctx.lineTo(x, topSurfaceBaselineY + asperity);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // BOTTOM SPECIMEN (STATIONARY SUBSTRATE)
      ctx.save();
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, bottomSurfaceBaselineY);

      // Draw bottom asperities (pointing up)
      for (let x = width; x >= 0; x -= 4) {
        const asperity = Math.sin(x * waveFreq * 1.1) * asperityAmp +
                         Math.sin(x * waveFreq * 2.8) * (asperityAmp * 0.35);
        ctx.lineTo(x, bottomSurfaceBaselineY - asperity);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 3. LUBRICANT FILM VISUALIZATION (if Lubrication ON)
      if (lubrication) {
        ctx.save();
        ctx.fillStyle = "rgba(6, 182, 212, 0.25)";
        ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);

        ctx.fillRect(0, topSurfaceBaselineY - 2, width, (bottomSurfaceBaselineY - topSurfaceBaselineY) + 6);
        ctx.strokeRect(0, topSurfaceBaselineY - 2, width, (bottomSurfaceBaselineY - topSurfaceBaselineY) + 6);
        ctx.restore();

        // Label lubricant hydrodynamic film
        ctx.fillStyle = "#06b6d4";
        ctx.font = "11px JetBrains Mono";
        ctx.fillText("FLUID / BOUNDARY FILM (SEPARATION h > 3σ)", 25, midY - 3);
      }

      // 4. DETECT ASPERITY INTERACTION & ADHESIVE JUNCTIONS
      // At points where top asperity and bottom asperity overlap, draw high-stress junctions
      for (let x = 60; x < width - 60; x += 32) {
        const topY = topSurfaceBaselineY +
          Math.sin((x + offsetX) * waveFreq) * asperityAmp +
          Math.cos((x + offsetX) * waveFreq * 2.3) * (asperityAmp * 0.4);

        const botY = bottomSurfaceBaselineY -
          (Math.sin(x * waveFreq * 1.1) * asperityAmp +
           Math.sin(x * waveFreq * 2.8) * (asperityAmp * 0.35));

        const gap = botY - topY;

        // If asperities contact or penetrate
        if (gap < 4) {
          // Highlight High Plastic Stress / Junction Formation
          ctx.save();
          ctx.fillStyle = lubrication ? "rgba(251, 191, 36, 0.5)" : "rgba(239, 68, 68, 0.75)";
          ctx.beginPath();
          ctx.arc(x, (topY + botY) / 2, Math.max(3, (4 - gap) * 2), 0, Math.PI * 2);
          ctx.fill();

          // Adhesive Junction Shear Vector (Arrows)
          ctx.strokeStyle = "#f87171";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - 8, (topY + botY) / 2);
          ctx.lineTo(x + 8, (topY + botY) / 2);
          ctx.stroke();
          ctx.restore();

          // Spawn wear debris particles if unlubricated and moving
          if (!lubrication && Math.random() < 0.18 * (load / 400)) {
            particles.push({
              x: x + (Math.random() * 4 - 2),
              y: (topY + botY) / 2,
              vx: (Math.random() * 2 + 1) * (speed / 1.5),
              vy: Math.random() * 2.5 - 1.25,
              life: 1.0,
              size: Math.random() * 2.5 + 1.5,
              color: Math.random() > 0.4 ? "#f87171" : "#fbbf24"
            });
          }
        }
      }

      // 5. UPDATE AND DRAW WEAR DEBRIS PARTICLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.015;

        if (p.life <= 0 || p.x > width) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. TECHNICAL HUD LABELS & OVERLAYS
      ctx.save();
      // Motion Vector Indicator (Upper specimen sliding velocity v)
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px JetBrains Mono";
      ctx.fillText(`SLIDING VELOCITY: v = ${speed.toFixed(2)} m/s →`, width - 260, 30);

      // Normal Load Arrow
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2, 15);
      ctx.lineTo(width / 2, 45);
      ctx.stroke();
      // arrow head
      ctx.beginPath();
      ctx.moveTo(width / 2 - 6, 38);
      ctx.lineTo(width / 2, 47);
      ctx.lineTo(width / 2 + 6, 38);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();
      ctx.fillText(`NORMAL LOAD W = ${load} N`, width / 2 + 12, 35);

      // Specimen identifiers
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px JetBrains Mono";
      ctx.fillText("SPECIMEN A: MOVING COUNTERFACE", 20, 25);
      ctx.fillText("SPECIMEN B: STATIONARY SUBSTRATE", 20, height - 15);

      // Asperity contact statistics HUD
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "11px JetBrains Mono";
      const apparentArea = 100; // mm2
      const contactPressure = (load / apparentArea).toFixed(2);
      ctx.fillText(`APPARENT AREA: ${apparentArea} mm² | NOMINAL PRESSURE: ${contactPressure} MPa`, 20, height - 35);
      ctx.fillText(`ROUGHNESS Ra: ${roughness.toFixed(2)} μm | LUBRICATION: ${lubrication ? 'ACTIVE (Boundary Film)' : 'DRY CONTACT'}`, 20, height - 50);

      // Watermark / Scientific Disclaimer
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.font = "10px Inter";
      ctx.fillText("Conceptual Tribological Visualization — Asperity Contact & Junction Shearing", width - 420, height - 15);

      ctx.restore();

      // Step motion forward
      if (!isPaused) {
        offsetX += speed * 1.5;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [load, speed, roughness, lubrication, isPaused, stageIndex]);

  return (
    <div className="relative w-full rounded-xl border border-slate-800 bg-[#090d16] overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-200">REAL-TIME CONTACT MECHANICS SIMULATOR</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>MODE: {lubrication ? "BOUNDARY LUBRICATED" : "DRY ADHESIVE CONTACT"}</span>
          <span>GRID: 40×40 μm EQUIV</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={960}
        height={340}
        className="w-full h-auto block tech-grid"
      />
    </div>
  );
};
