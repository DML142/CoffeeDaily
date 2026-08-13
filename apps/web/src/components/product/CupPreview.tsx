"use client";

import type { Size, Vessel } from "@coffee-daily/types";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { CupModel } from "@/components/product/CupModel";
import { advanceSlides, dropSlide } from "@/components/product/cupSlides";
import type { CupSlide } from "@/components/product/cupSlides";

export type CupPreviewProps = {
  vessel: Vessel;
  size: Size;
  isActive: boolean;
  onReady: () => void;
  onContextLost: () => void;
};

export function CupPreview({
  vessel,
  size,
  isActive,
  onReady,
  onContextLost,
}: CupPreviewProps) {
  const [slides, setSlides] = useState<CupSlide[]>([{ id: 0, vessel, size }]);
  const nextIdRef = useRef(1);
  const optionKey = `${vessel}-${size}`;
  const previousKeyRef = useRef(optionKey);

  useEffect(() => {
    if (optionKey === previousKeyRef.current) return;
    previousKeyRef.current = optionKey;
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    setSlides((current) => advanceSlides(current, { id, vessel, size }));
  }, [optionKey, vessel, size]);

  const handleExited = useCallback((id: number) => {
    setSlides((current) => dropSlide(current, id));
  }, []);

  return (
    <Canvas
      className="pointer-events-none"
      dpr={[1, 2]}
      frameloop={isActive ? "always" : "demand"}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 32, position: [0, 0, 8] }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onContextLost);
      }}
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} />
      <directionalLight position={[-5, 2, -4]} intensity={1.1} />
      {slides.map((slide, index) => (
        <Suspense key={slide.id} fallback={null}>
          <CupModel
            vessel={slide.vessel}
            size={slide.size}
            isExiting={index < slides.length - 1}
            onExited={() => handleExited(slide.id)}
            onLoaded={onReady}
          />
        </Suspense>
      ))}
    </Canvas>
  );
}
