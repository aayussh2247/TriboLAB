import React, { useRef, useEffect, useState } from 'react';

interface SurfaceProps {
  load: number;
  roughness: number;
  slidingDistance: number;
  viewMode?: '3D View' | 'Top View' | 'Side View';
  colorMap?: 'Viridis' | 'Rainbow' | 'Thermal';
  showGrid?: boolean;
  realisticTexture?: boolean;
  className?: string;
  height?: number;
}

export const SurfaceTopographyCanvas: React.FC<SurfaceProps> = ({
  load = 500,
  roughness = 1.0,
  slidingDistance = 5000,
  viewMode = '3D View',
  colorMap = 'Viridis',
  showGrid = true,
  realisticTexture = false,
  className = '',
  height = 240,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotX, setRotX] = useState<number>(35); // degrees
  const [rotZ, setRotZ] = useState<number>(-45); // degrees
  const isDragging = useRef<boolean>(false);
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update rotation preset when viewMode changes
  useEffect(() => {
    if (viewMode === 'Top View') {
      setRotX(90);
      setRotZ(0);
    } else if (viewMode === 'Side View') {
      setRotX(5);
      setRotZ(0);
    } else {
      setRotX(35);
      setRotZ(-45);
    }
  }, [viewMode]);

  // Color mapping helper
  const getColor = (val: number, min: number, max: number): string => {
    // normalized 0..1
    const t = Math.max(0, Math.min(1, (val - min) / (max - min)));

    if (realisticTexture) {
      // Metallic steel sheen with dark wear groove
      const grey = Math.round(110 + t * 90);
      return `rgb(${grey}, ${grey + 4}, ${grey + 8})`;
    }

    if (colorMap === 'Viridis') {
      // Approximate Viridis: purple -> blue -> teal -> green -> yellow
      if (t < 0.25) {
        const f = t / 0.25;
        return `rgb(${Math.round(68 + f * (49 - 68))}, ${Math.round(1 + f * (104 - 1))}, ${Math.round(84 + f * (142 - 84))})`;
      } else if (t < 0.5) {
        const f = (t - 0.25) / 0.25;
        return `rgb(${Math.round(49 + f * (33 - 49))}, ${Math.round(104 + f * (165 - 104))}, ${Math.round(142 + f * (133 - 142))})`;
      } else if (t < 0.75) {
        const f = (t - 0.5) / 0.25;
        return `rgb(${Math.round(33 + f * (115 - 33))}, ${Math.round(165 + f * (208 - 165))}, ${Math.round(133 + f * (84 - 133))})`;
      } else {
        const f = (t - 0.75) / 0.25;
        return `rgb(${Math.round(115 + f * (253 - 115))}, ${Math.round(208 + f * (231 - 208))}, ${Math.round(84 + f * (37 - 84))})`;
      }
    } else if (colorMap === 'Thermal') {
      // Black -> Red -> Orange -> Yellow -> White
      const r = Math.round(Math.min(255, t * 340));
      const g = Math.round(Math.min(255, Math.max(0, (t - 0.35) * 380)));
      const b = Math.round(Math.min(255, Math.max(0, (t - 0.7) * 450)));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Rainbow / Jet: Blue -> Cyan -> Green -> Yellow -> Red
      const h = (1.0 - t) * 240; // 240 (blue) down to 0 (red)
      return `hsl(${h}, 90%, 50%)`;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const canvasHeight = canvas.height;

    ctx.clearRect(0, 0, width, canvasHeight);

    // Compute surface grid points (X: 0..2.0 mm, Y: 0..2.0 mm)
    const gridSize = 28;
    const grid: { x: number; y: number; z: number }[][] = [];

    // Wear groove depth depends on load and sliding distance
    const grooveDepth = 6.0 * (load / 500) * Math.min(1.8, Math.sqrt(slidingDistance / 5000));
    const grooveWidth = 0.35 * Math.sqrt(load / 500); // mm

    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      const px = (i / (gridSize - 1)) * 2.0; // 0..2 mm
      for (let j = 0; j < gridSize; j++) {
        const py = (j / (gridSize - 1)) * 2.0; // 0..2 mm

        // Distance from sliding track center (center at py = 1.0 mm)
        const distFromTrack = Math.abs(py - 1.0);

        // Gaussian groove with pile-up ridges on edges
        let z = 0;
        if (distFromTrack < grooveWidth * 1.5) {
          const u = distFromTrack / grooveWidth;
          // Wear scar dip
          z = -grooveDepth * Math.exp(-2.5 * u * u);
          // Material displacement pile-up ridges on edges
          z += (grooveDepth * 0.28) * Math.exp(-5.0 * Math.pow(u - 1.05, 2));
        }

        // Micro-roughness asperities
        const asperity =
          (Math.sin(px * 16 + j) * Math.cos(py * 14) + Math.sin(px * 32)) *
          (roughness * 0.85);

        z += asperity;

        // Clamp between -10 and 10 um
        z = Math.max(-10, Math.min(10, z));

        grid[i][j] = { x: px, y: py, z };
      }
    }

    // 3D Projection math
    const radX = (rotX * Math.PI) / 180;
    const radZ = (rotZ * Math.PI) / 180;

    const project = (x: number, y: number, z: number) => {
      // Center around 0
      const cx = (x - 1.0) * 80;
      const cy = (y - 1.0) * 80;
      const cz = (z / 10.0) * 35; // height scale

      // Rotate around Z
      const x1 = cx * Math.cos(radZ) - cy * Math.sin(radZ);
      const y1 = cx * Math.sin(radZ) + cy * Math.cos(radZ);

      // Rotate around X
      const y2 = y1 * Math.cos(radX) - cz * Math.sin(radX);
      const z2 = y1 * Math.sin(radX) + cz * Math.cos(radX);

      // 2D screen coordinate
      const screenX = width / 2 + x1;
      const screenY = canvasHeight / 2 - y2 + 10;

      return { sx: screenX, sy: screenY, depth: z2 };
    };

    // Draw polygons back-to-front (simple painter's algorithm)
    const quads: {
      pts: { sx: number; sy: number }[];
      avgZ: number;
      depth: number;
    }[] = [];

    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        const p1 = grid[i][j];
        const p2 = grid[i + 1][j];
        const p3 = grid[i + 1][j + 1];
        const p4 = grid[i][j + 1];

        const pr1 = project(p1.x, p1.y, p1.z);
        const pr2 = project(p2.x, p2.y, p2.z);
        const pr3 = project(p3.x, p3.y, p3.z);
        const pr4 = project(p4.x, p4.y, p4.z);

        const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
        const depth = (pr1.depth + pr2.depth + pr3.depth + pr4.depth) / 4;

        quads.push({
          pts: [pr1, pr2, pr3, pr4],
          avgZ,
          depth,
        });
      }
    }

    // Sort by depth
    quads.sort((a, b) => a.depth - b.depth);

    // Draw quads
    quads.forEach((quad) => {
      ctx.beginPath();
      ctx.moveTo(quad.pts[0].sx, quad.pts[0].sy);
      ctx.lineTo(quad.pts[1].sx, quad.pts[1].sy);
      ctx.lineTo(quad.pts[2].sx, quad.pts[2].sy);
      ctx.lineTo(quad.pts[3].sx, quad.pts[3].sy);
      ctx.closePath();

      ctx.fillStyle = getColor(quad.avgZ, -10, 10);
      ctx.fill();

      if (showGrid) {
        ctx.strokeStyle = realisticTexture
          ? 'rgba(0,0,0,0.15)'
          : 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });

    // Draw Bounding Axes Box
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1;

    // Corner base lines
    const c00 = project(0, 0, -10);
    const c10 = project(2, 0, -10);
    const c11 = project(2, 2, -10);
    const c01 = project(0, 2, -10);

    ctx.beginPath();
    ctx.moveTo(c00.sx, c00.sy);
    ctx.lineTo(c10.sx, c10.sy);
    ctx.lineTo(c11.sx, c11.sy);
    ctx.lineTo(c01.sx, c01.sy);
    ctx.closePath();
    ctx.stroke();

    // Axis coordinate labels
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('0.0', c00.sx - 15, c00.sy + 5);
    ctx.fillText('X (mm) 2.0', c10.sx + 4, c10.sy + 10);
    ctx.fillText('Y (mm) 2.0', c01.sx - 35, c01.sy + 10);

    // Height tick indicators on left
    const topZ = project(0, 0, 10);
    ctx.beginPath();
    ctx.moveTo(c00.sx, c00.sy);
    ctx.lineTo(topZ.sx, topZ.sy);
    ctx.stroke();

    ctx.fillText('10 µm', topZ.sx - 34, topZ.sy);
    ctx.fillText('-10 µm', c00.sx - 38, c00.sy);
  }, [load, roughness, slidingDistance, rotX, rotZ, viewMode, colorMap, showGrid, realisticTexture]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setRotZ((prev) => prev + dx * 0.7);
    setRotX((prev) => Math.max(5, Math.min(85, prev - dy * 0.7)));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-grab active:cursor-grabbing w-full h-auto max-h-[260px]"
      />

      {/* Colorbar Legend on Right */}
      <div className="absolute right-2 top-3 bottom-3 w-6 flex flex-col items-center justify-between text-[9px] font-mono text-[#64748B]">
        <span>10</span>
        <span>5</span>
        <span>0</span>
        <span>-5</span>
        <span>-10</span>
        {/* Gradient bar */}
        <div
          className="w-2.5 flex-1 my-1 rounded-sm shadow-inner"
          style={{
            background:
              colorMap === 'Viridis'
                ? 'linear-gradient(to bottom, #FDE725, #73D055, #21908D, #31688E, #440154)'
                : colorMap === 'Thermal'
                ? 'linear-gradient(to bottom, #FFF, #FEF08A, #F97316, #DC2626, #000)'
                : 'linear-gradient(to bottom, #EF4444, #F59E0B, #10B981, #06B6D4, #3B82F6)',
          }}
        />
        <span className="text-[8px] text-[#475569]">µm</span>
      </div>
    </div>
  );
};
