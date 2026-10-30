import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Flame,
  Layers,
  Gauge,
  RefreshCw,
  ZoomIn,
  Zap,
  Activity,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from "lucide-react";

interface TribologySimulationProps {
  load: number;          // 10 - 2000 N
  speed: number;         // 0.05 - 20 m/s
  roughness: number;     // 0.05 - 20 um
  hardness?: number;     // 0.1 - 25 GPa
  temperature?: number;  // 0 - 500 °C
  materialPair?: string; // Steel - Steel, etc.
  lubrication: boolean;  // true/false
  stageIndex?: number;
  isPaused?: boolean;
}

interface WearFlake {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  points: { dx: number; dy: number }[];
  size: number;
  life: number;
  maxLife: number;
  temperature: number; // 0 to 1
  color: string;
}

interface FractureJunction {
  id: number;
  x: number;
  topY: number;
  botY: number;
  stretch: number;       // 0 to 1 before breaking
  neckingWidth: number;  // thinning as it stretches
  maxStretch: number;
  stress: number;        // MPa
  isBreaking: boolean;
  crackProgress: number; // 0 to 1
}

export const AdhesiveWearSimulation: React.FC<TribologySimulationProps> = ({
  load,
  speed,
  roughness,
  hardness = 2.0,
  temperature = 100,
  materialPair = "Steel - Steel",
  lubrication,
  isPaused: externalPaused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [internalPaused, setInternalPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [showSubsurfaceStress, setShowSubsurfaceStress] = useState<boolean>(true);
  const [showThermalGlow, setShowThermalGlow] = useState<boolean>(true);
  const [showCracks, setShowCracks] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [detachedFlakesCount, setDetachedFlakesCount] = useState<number>(0);
  const [lastFractureEvent, setLastFractureEvent] = useState<string>("Monitoring Asperity Strains");

  // Force fracture flag
  const forceFractureTrigger = useRef<boolean>(false);

  const isPaused = externalPaused || internalPaused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offsetX = 0;
    let localDetachedCounter = 0;

    // Detached wear flakes (broken off irregular polygons)
    const wearFlakes: WearFlake[] = [];

    // Incandescent friction sparks
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }
    const sparks: Spark[] = [];

    // Permanent cumulative gouge scars in the stationary substrate
    const gougeScars: { x: number; depth: number; width: number }[] = [];

    // Active stretching & breaking junctions
    const activeJunctions: Map<number, FractureJunction> = new Map();
    let nextJunctionId = 1;

    // Asperity roughness height generator with localized wear scars subtracted
    const computeRoughnessHeight = (xPos: number, isTop: boolean): number => {
      const baseAmp = Math.min(24, 6 + roughness * 3.5);
      const sign = isTop ? 1 : -1;
      
      const h1 = Math.sin(xPos * 0.038) * baseAmp;
      const h2 = Math.sin(xPos * 0.095 + 1.2) * (baseAmp * 0.42);
      const h3 = Math.cos(xPos * 0.22 - 0.7) * (baseAmp * 0.18);
      const h4 = Math.sin(xPos * 0.48 + 2.1) * (baseAmp * 0.08);

      let h = sign * (h1 + h2 + h3 + h4);

      // Apply cumulative torn wear scars to the bottom stationary specimen
      if (!isTop) {
        for (const scar of gougeScars) {
          const dx = Math.abs(xPos - scar.x);
          if (dx < scar.width) {
            const factor = Math.cos((dx / scar.width) * (Math.PI / 2));
            h += scar.depth * factor; // gouges deeper into substrate
          }
        }
      }

      return h;
    };

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      if (zoomLevel > 1.0) {
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoomLevel, zoomLevel);
        ctx.translate(-width / 2, -height / 2);
      }

      const midY = height / 2;
      const hardnessGPa = Math.max(0.5, hardness);
      const plasticPenetration = Math.min(18, (load / (hardnessGPa * 80)) * 6.5);
      const topSurfaceBaselineY = midY - 30 + plasticPenetration;
      const bottomSurfaceBaselineY = midY + 30;

      const frictionCoeff = lubrication ? 0.07 : (materialPair.includes("Bronze") ? 0.22 : 0.48);
      const flashTempRiseC = Math.min(680, (frictionCoeff * load * speed * 0.45) / Math.sqrt(hardnessGPa));
      const peakContactTempC = temperature + flashTempRiseC;

      // 1. Engineering CAD Sub-Micron Grid
      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(30, 41, 59, 0.45)";
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Subsurface Shear Stress FEA Heatmap (Von Mises Contours)
      if (showSubsurfaceStress) {
        const gradient = ctx.createLinearGradient(0, bottomSurfaceBaselineY, 0, height);
        gradient.addColorStop(0.0, "rgba(239, 68, 68, 0.38)");   // High surface shear yield
        gradient.addColorStop(0.22, "rgba(249, 115, 22, 0.28)");  // Shear maximum zone
        gradient.addColorStop(0.5, "rgba(234, 179, 8, 0.18)");   // Elastic transition
        gradient.addColorStop(0.85, "rgba(14, 165, 233, 0.08)");  // Hydrostatic core
        gradient.addColorStop(1.0, "rgba(15, 23, 42, 0.02)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, bottomSurfaceBaselineY, width, height - bottomSurfaceBaselineY);

        ctx.strokeStyle = "rgba(249, 115, 22, 0.25)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        [18, 40, 75, 115].forEach((depthOffset) => {
          ctx.beginPath();
          for (let x = 0; x < width; x += 10) {
            const wave = Math.sin(x * 0.04) * 3;
            if (x === 0) ctx.moveTo(x, bottomSurfaceBaselineY + depthOffset + wave);
            else ctx.lineTo(x, bottomSurfaceBaselineY + depthOffset + wave);
          }
          ctx.stroke();
        });
        ctx.setLineDash([]);
      }

      // 3. Stationary Bottom Specimen (Substrate)
      ctx.save();
      const botGrad = ctx.createLinearGradient(0, bottomSurfaceBaselineY, 0, height);
      if (materialPair.includes("Bronze")) {
        botGrad.addColorStop(0, "#78350f");
        botGrad.addColorStop(0.3, "#451a03");
        botGrad.addColorStop(1, "#1c1917");
      } else {
        botGrad.addColorStop(0, "#334155");
        botGrad.addColorStop(0.18, "#1e293b");
        botGrad.addColorStop(0.65, "#0f172a");
        botGrad.addColorStop(1, "#020617");
      }
      ctx.fillStyle = botGrad;

      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, bottomSurfaceBaselineY + computeRoughnessHeight(width, false));

      for (let x = width; x >= 0; x -= 3) {
        const asperityH = computeRoughnessHeight(x, false);
        ctx.lineTo(x, bottomSurfaceBaselineY + asperityH);
      }
      ctx.closePath();
      ctx.fill();

      // Metallic Specular Rim
      ctx.strokeStyle = materialPair.includes("Bronze") ? "#f59e0b" : "#94a3b8";
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 3) {
        const asperityH = computeRoughnessHeight(x, false);
        if (x === 0) ctx.moveTo(x, bottomSurfaceBaselineY + asperityH);
        else ctx.lineTo(x, bottomSurfaceBaselineY + asperityH);
      }
      ctx.stroke();
      ctx.restore();

      // 4. Moving Top Counterface (Sliding Velocity v Left to Right)
      ctx.save();
      const topGrad = ctx.createLinearGradient(0, 0, 0, topSurfaceBaselineY + 20);
      topGrad.addColorStop(0, "#0f172a");
      topGrad.addColorStop(0.5, "#1e293b");
      topGrad.addColorStop(0.85, "#334155");
      topGrad.addColorStop(1, "#475569");
      ctx.fillStyle = topGrad;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, topSurfaceBaselineY + computeRoughnessHeight(width + offsetX, true));

      for (let x = width; x >= 0; x -= 3) {
        const asperityH = computeRoughnessHeight(x + offsetX, true);
        ctx.lineTo(x, topSurfaceBaselineY + asperityH);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 3) {
        const asperityH = computeRoughnessHeight(x + offsetX, true);
        if (x === 0) ctx.moveTo(x, topSurfaceBaselineY + asperityH);
        else ctx.lineTo(x, topSurfaceBaselineY + asperityH);
      }
      ctx.stroke();
      ctx.restore();

      // 5. Lubricant Protective Layer (if Lubricated)
      if (lubrication) {
        ctx.save();
        const filmHeight = Math.max(8, bottomSurfaceBaselineY - topSurfaceBaselineY + 8);
        const filmGrad = ctx.createLinearGradient(0, topSurfaceBaselineY - 4, 0, bottomSurfaceBaselineY + 4);
        filmGrad.addColorStop(0, "rgba(6, 182, 212, 0.40)");
        filmGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.25)");
        filmGrad.addColorStop(1, "rgba(14, 165, 233, 0.15)");
        ctx.fillStyle = filmGrad;
        ctx.fillRect(0, topSurfaceBaselineY - 4, width, filmHeight);

        // Fluid Streamlines
        ctx.strokeStyle = "rgba(125, 211, 252, 0.65)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 6]);
        for (let s = 1; s <= 3; s++) {
          const streamY = topSurfaceBaselineY + (filmHeight * s) / 4;
          const streamSpeedOffset = (offsetX * (1.0 - s / 4)) % 40;
          ctx.beginPath();
          ctx.moveTo(-40 + streamSpeedOffset, streamY);
          ctx.lineTo(width + 40, streamY);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.restore();
      }

      // 6. REALISTIC ASPERITY INTERFACE: COLD-WELDING, EXTENSION, CRACK PROPAGATION & BREAKING
      const scanStep = 10;
      for (let x = 50; x < width - 50; x += scanStep) {
        const topY = topSurfaceBaselineY + computeRoughnessHeight(x + offsetX, true);
        const botY = bottomSurfaceBaselineY + computeRoughnessHeight(x, false);
        const gap = botY - topY;

        // Summit interaction zone
        if (gap < (lubrication ? 2.0 : 4.5)) {
          const summitKey = Math.floor(x / 30);

          // Thermal Flash Glow
          if (showThermalGlow) {
            ctx.save();
            const glowR = Math.max(8, 16 * (peakContactTempC / 400));
            const heatBloom = ctx.createRadialGradient(x, (topY + botY) / 2, 0, x, (topY + botY) / 2, glowR);
            if (lubrication) {
              heatBloom.addColorStop(0, "rgba(254, 240, 138, 0.85)");
              heatBloom.addColorStop(1, "rgba(251, 146, 60, 0.0)");
            } else {
              heatBloom.addColorStop(0, "rgba(255, 255, 255, 0.95)");
              heatBloom.addColorStop(0.3, "rgba(249, 115, 22, 0.85)");
              heatBloom.addColorStop(1, "rgba(239, 68, 68, 0.0)");
            }
            ctx.fillStyle = heatBloom;
            ctx.beginPath();
            ctx.arc(x, (topY + botY) / 2, glowR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Register or retrieve active micro-junction bridge
          if (!activeJunctions.has(summitKey)) {
            activeJunctions.set(summitKey, {
              id: nextJunctionId++,
              x: x,
              topY: topY,
              botY: botY,
              stretch: 0,
              neckingWidth: 4.5,
              maxStretch: Math.random() * 12 + 10,
              stress: 450,
              isBreaking: false,
              crackProgress: 0,
            });
          }

          const junc = activeJunctions.get(summitKey)!;
          junc.topY = topY;
          junc.botY = botY;

          // As sliding proceeds, tangential displacement stretches welded junction
          if (!isPaused) {
            junc.stretch += speed * speedMultiplier * 0.45;
            junc.neckingWidth = Math.max(1.0, 4.5 - (junc.stretch / junc.maxStretch) * 3.5);
            junc.stress = Math.min(1850, 450 + (junc.stretch / junc.maxStretch) * 1200);
          }

          // DRAW COLD-WELDED JUNCTION (PLASTIC NECKING BRIDGE)
          ctx.save();
          const bridgeGradient = ctx.createLinearGradient(x - junc.stretch, topY, x, botY);
          if (lubrication) {
            bridgeGradient.addColorStop(0, "#fbbf24");
            bridgeGradient.addColorStop(1, "#f59e0b");
          } else {
            bridgeGradient.addColorStop(0, "#f87171"); // High plastic shear necking
            bridgeGradient.addColorStop(0.5, "#ffffff"); // Incandescent plastic yield center
            bridgeGradient.addColorStop(1, "#ef4444");
          }
          ctx.strokeStyle = bridgeGradient;
          ctx.lineWidth = junc.neckingWidth;
          ctx.beginPath();
          ctx.moveTo(x - junc.stretch, topY);
          ctx.lineTo(x, botY);
          ctx.stroke();
          ctx.restore();

          // DRAW CRACK PROPAGATION LINES (SUB-SURFACE TEARING)
          if (showCracks && !lubrication && junc.stretch > junc.maxStretch * 0.6) {
            junc.crackProgress = Math.min(1.0, (junc.stretch - junc.maxStretch * 0.6) / (junc.maxStretch * 0.4));
            
            ctx.save();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            // Subsurface shear crack shooting downwards into substrate
            const crackDepth = junc.crackProgress * 12;
            ctx.moveTo(x, botY);
            ctx.lineTo(x - 2, botY + crackDepth * 0.4);
            ctx.lineTo(x + 3, botY + crackDepth * 0.7);
            ctx.lineTo(x - 1, botY + crackDepth);
            ctx.stroke();

            // Stress concentration highlight at crack tip
            ctx.fillStyle = "#facc15";
            ctx.beginPath();
            ctx.arc(x - 1, botY + crackDepth, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // FRACTURE CONDITION: STRETCH EXCEEDS CRITICAL SHEAR DUCTILITY OR FORCED TRIGGER
          const shouldBreak =
            (!lubrication && junc.stretch >= junc.maxStretch) ||
            (forceFractureTrigger.current && junc.stretch > 4);

          if (shouldBreak) {
            if (forceFractureTrigger.current) {
              forceFractureTrigger.current = false;
            }

            // A. MATERIAL TEARS OFF! (Form an irregular polygon wear debris flake)
            const flakeSize = Math.random() * 4 + 3.5;
            const flakePoints = [
              { dx: -flakeSize, dy: -flakeSize * 0.6 },
              { dx: flakeSize * 0.8, dy: -flakeSize * 0.9 },
              { dx: flakeSize * 1.1, dy: flakeSize * 0.4 },
              { dx: -flakeSize * 0.3, dy: flakeSize },
              { dx: -flakeSize * 0.9, dy: flakeSize * 0.2 },
            ];

            wearFlakes.push({
              x: x,
              y: botY,
              vx: (Math.random() * 3 + 1.5) * (speed / 1.0),
              vy: -(Math.random() * 2.5 + 1.0),
              rotation: Math.random() * Math.PI * 2,
              vRot: (Math.random() - 0.5) * 0.25,
              points: flakePoints,
              size: flakeSize,
              life: 1.0,
              maxLife: 1.0,
              temperature: 1.0,
              color: materialPair.includes("Bronze") ? "#f59e0b" : "#e2e8f0",
            });

            // B. SPRAY FRICTION SPARKS
            for (let s = 0; s < 6; s++) {
              sparks.push({
                x: x,
                y: (topY + botY) / 2,
                vx: (Math.random() * 5 + 2) * (speed / 1.0),
                vy: (Math.random() - 0.6) * 4,
                life: 1.0,
              });
            }

            // C. LEAVE GOUGE SCAR (Torn crater in substrate)
            if (gougeScars.length > 25) gougeScars.shift();
            gougeScars.push({
              x: x,
              depth: Math.random() * 5 + 3,
              width: Math.random() * 12 + 10,
            });

            // D. UPDATE COUNTER & NOTIFICATION
            localDetachedCounter++;
            setDetachedFlakesCount(localDetachedCounter);
            setLastFractureEvent(`Sub-surface rupture at x=${Math.round(x)}px | Shear Stress τ=1,820 MPa`);

            // Reset junction
            activeJunctions.delete(summitKey);
          }
        } else {
          // Asperities no longer in contact
          activeJunctions.delete(Math.floor(x / 30));
        }
      }

      // 7. RENDER & UPDATE TEARING WEAR FLAKES (Real Mechanical Breakage Pieces)
      for (let i = wearFlakes.length - 1; i >= 0; i--) {
        const flake = wearFlakes[i];
        if (!isPaused) {
          flake.x += flake.vx * speedMultiplier;
          flake.y += flake.vy * speedMultiplier;
          flake.vy += 0.09 * speedMultiplier; // gravity pull
          flake.rotation += flake.vRot * speedMultiplier;
          flake.life -= 0.012 * speedMultiplier;
          flake.temperature = Math.max(0, flake.life);
        }

        if (flake.life <= 0 || flake.x > width + 40 || flake.y > height) {
          wearFlakes.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rotation);
        ctx.globalAlpha = Math.min(1.0, flake.life * 1.5);

        // Debris color changes from incandescent white-orange to cold oxidized metallic fragment
        let flakeShade = flake.color;
        if (flake.temperature > 0.6) {
          flakeShade = "#fef08a"; // hot incandescent
        } else if (flake.temperature > 0.3) {
          flakeShade = "#f97316"; // glowing orange
        }

        ctx.fillStyle = flakeShade;
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1;

        ctx.beginPath();
        flake.points.forEach((pt, ptIdx) => {
          if (ptIdx === 0) ctx.moveTo(pt.dx, pt.dy);
          else ctx.lineTo(pt.dx, pt.dy);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      // 8. RENDER SPARKS
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        if (!isPaused) {
          sp.x += sp.vx * speedMultiplier;
          sp.y += sp.vy * speedMultiplier;
          sp.vy += 0.06 * speedMultiplier;
          sp.life -= 0.03 * speedMultiplier;
        }

        if (sp.life <= 0 || sp.x > width + 20) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = sp.life;
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 9. UPDATE HORIZONTAL SLIDING DISPLACEMENT
      if (!isPaused) {
        offsetX += speed * 1.2 * speedMultiplier;
      }

      ctx.restore(); // Undo zoom for clean 1:1 HUD

      // 10. REAL-TIME TRIBOLOGY HUD OVERLAY
      ctx.save();
      // Top HUD Box
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.strokeStyle = "rgba(51, 65, 85, 0.75)";
      ctx.lineWidth = 1;
      ctx.fillRect(16, 12, 420, 56);
      ctx.strokeRect(16, 12, 420, 56);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText(`NORMAL LOAD: W = ${load} N  (Penetration: ${plasticPenetration.toFixed(1)} px)`, 26, 30);

      ctx.fillStyle = lubrication ? "#4ade80" : "#f87171";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText(
        `REGIME: ${lubrication ? 'BOUNDARY LUBRICATED (Shielded)' : 'DRY ADHESIVE SCUFFING'} | COF μ=${frictionCoeff.toFixed(2)}`,
        26,
        45
      );

      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `FLASH TEMP: ${peakContactTempC.toFixed(0)} °C | ACTIVE JUNCTIONS: ${activeJunctions.size}`,
        26,
        60
      );

      // Bottom Fracture Event Bar
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.fillRect(16, height - 36, width - 32, 26);
      ctx.strokeStyle = "rgba(51, 65, 85, 0.6)";
      ctx.strokeRect(16, height - 36, width - 32, 26);

      ctx.fillStyle = "#facc15";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillText(`[FRACTURE TELEMETRY] ${lastFractureEvent}`, 26, height - 19);

      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`TOTAL TORN FLAKES: ${localDetachedCounter}`, width - 210, height - 19);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    load,
    speed,
    roughness,
    hardness,
    temperature,
    materialPair,
    lubrication,
    isPaused,
    speedMultiplier,
    showSubsurfaceStress,
    showThermalGlow,
    showCracks,
    zoomLevel,
  ]);

  const handleTriggerFracture = () => {
    forceFractureTrigger.current = true;
  };

  const frictionCoeff = lubrication ? 0.07 : (materialPair.includes("Bronze") ? 0.22 : 0.48);
  const hardnessGPa = Math.max(0.5, hardness);
  const plasticPenetration = Math.min(18, (load / (hardnessGPa * 80)) * 6.5);

  return (
    <div className="space-y-3 font-sans">
      {/* Simulation Controls Toolbar */}
      <div className="bg-white border border-[#E8E4DA] rounded-lg p-2.5 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInternalPaused(!internalPaused)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition ${
              internalPaused
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#1E293B] border border-[#DDD5BF]'
            }`}
          >
            {internalPaused ? <Play size={14} /> : <Pause size={14} />}
            <span>{internalPaused ? 'Resume Motion' : 'Pause'}</span>
          </button>

          {/* Trigger Mechanical Fracture Button */}
          <button
            onClick={handleTriggerFracture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs"
            title="Force immediate asperity cold-weld shear rupture"
          >
            <Zap size={14} />
            <span>💥 Trigger Shear Fracture</span>
          </button>
        </div>

        {/* View Controls & Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCracks(!showCracks)}
            className={`px-2.5 py-1.5 rounded font-semibold transition text-[11px] ${
              showCracks ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-[#FAF8F5] text-slate-600 border border-[#E8E4DA]'
            }`}
          >
            Cracks: {showCracks ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowSubsurfaceStress(!showSubsurfaceStress)}
            className={`px-2.5 py-1.5 rounded font-semibold transition text-[11px] ${
              showSubsurfaceStress ? 'bg-[#FFF2EC] text-[#F95721] border border-[#FED7AA]' : 'bg-[#FAF8F5] text-slate-600 border border-[#E8E4DA]'
            }`}
          >
            FEA Stress: {showSubsurfaceStress ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowThermalGlow(!showThermalGlow)}
            className={`px-2.5 py-1.5 rounded font-semibold transition text-[11px] ${
              showThermalGlow ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-[#FAF8F5] text-slate-600 border border-[#E8E4DA]'
            }`}
          >
            Thermal Flash: {showThermalGlow ? 'ON' : 'OFF'}
          </button>

          {/* Zoom Toggle */}
          <button
            onClick={() => setZoomLevel(zoomLevel === 1.0 ? 1.6 : 1.0)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E4DA] text-slate-700 font-semibold text-[11px]"
          >
            <ZoomIn size={13} />
            <span>{zoomLevel === 1.0 ? '1.0x Zoom' : '1.6x Zoom'}</span>
          </button>
        </div>
      </div>

      {/* Main High-Performance Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-[#1E293B] shadow-md bg-[#070b14]">
        <canvas
          ref={canvasRef}
          width={880}
          height={380}
          className="w-full h-[380px] block"
        />
      </div>

      {/* Real-time Tearing & Fracture Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-white border border-[#E8E4DA] text-center">
          <div className="text-[10px] text-slate-500 uppercase">Detached Wear Flakes</div>
          <div className="text-sm font-bold text-rose-600 mt-0.5">{detachedFlakesCount} Flakes</div>
        </div>
        <div className="p-2 rounded bg-white border border-[#E8E4DA] text-center">
          <div className="text-[10px] text-slate-500 uppercase">Flash Temperature Rise</div>
          <div className="text-sm font-bold text-[#F95721] mt-0.5">
            +{(frictionCoeff * load * speed * 0.45).toFixed(0)} °C
          </div>
        </div>
        <div className="p-2 rounded bg-white border border-[#E8E4DA] text-center">
          <div className="text-[10px] text-slate-500 uppercase">Subsurface Yield Depth</div>
          <div className="text-sm font-bold text-slate-800 mt-0.5">
            {(plasticPenetration * 1.8).toFixed(1)} μm
          </div>
        </div>
        <div className="p-2 rounded bg-white border border-[#E8E4DA] text-center">
          <div className="text-[10px] text-slate-500 uppercase">Shear Failure Mode</div>
          <div className="text-sm font-bold text-emerald-700 mt-0.5">
            {lubrication ? 'Hydrodynamic Film' : 'Adhesive Cold-Weld Fracture'}
          </div>
        </div>
      </div>
    </div>
  );
};
