"use client";

import type { Size, Vessel } from "@coffee-daily/types";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Box3, DoubleSide, Mesh, MeshPhysicalMaterial, Vector3 } from "three";
import type { Group } from "three";

const MODEL_URLS: Record<Vessel, string> = {
  glass: "/models/glass/scene.gltf",
  plastic: "/models/plastic/plastic_cup.glb",
  paper: "/models/papercup/papercup.glb",
  ceramic: "/models/ceramic/ceramic_cup.glb",
};

const SIZE_SCALES: Record<Size, number> = {
  s: 0.82,
  m: 1,
  l: 1.18,
};

const TARGET_EXTENT = 2.4;
const SLIDE_SECONDS = 0.4;
const SPIN_RATE = 0.7;
const TILT = 0.18;

const glassMaterial = new MeshPhysicalMaterial({
  color: "#ffffff",
  roughness: 0.06,
  metalness: 0,
  transparent: true,
  opacity: 0.34,
  side: DoubleSide,
});

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function easeInOutQuad(progress: number) {
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - (-2 * progress + 2) ** 2 / 2;
}

export type CupModelProps = {
  vessel: Vessel;
  size: Size;
  isExiting: boolean;
  onExited: () => void;
  onLoaded: () => void;
};

export function CupModel({
  vessel,
  size,
  isExiting,
  onExited,
  onLoaded,
}: CupModelProps) {
  const { viewport } = useThree();
  const { scene } = useGLTF(MODEL_URLS[vessel]);
  const slideRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);
  const phaseRef = useRef<"enter" | "hold" | "exit">("enter");
  const elapsedRef = useRef(0);
  const exitFromRef = useRef(0);
  const hasExitedRef = useRef(false);

  const object = useMemo(() => {
    const root = scene.clone(true);
    if (vessel === "glass") {
      root.traverse((child) => {
        if (child instanceof Mesh) child.material = glassMaterial;
      });
    }
    const bounds = new Box3().setFromObject(root);
    const extent = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const fit = Math.min(
      TARGET_EXTENT / (extent.y || 1),
      TARGET_EXTENT / (extent.x || 1),
    );
    root.scale.setScalar(fit);
    root.position.set(-center.x * fit, -center.y * fit, -center.z * fit);
    return root;
  }, [scene, vessel]);

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  useEffect(() => {
    if (!isExiting) return;
    phaseRef.current = "exit";
    elapsedRef.current = 0;
    exitFromRef.current = slideRef.current?.position.x ?? 0;
  }, [isExiting]);

  useFrame((_, delta) => {
    const slide = slideRef.current;
    const spin = spinRef.current;
    if (!slide || !spin) return;

    spin.rotation.y += delta * SPIN_RATE;

    if (phaseRef.current === "hold") return;

    elapsedRef.current += delta;
    const progress = Math.min(1, elapsedRef.current / SLIDE_SECONDS);
    const travel = viewport.width;

    if (phaseRef.current === "enter") {
      slide.position.x = -travel * (1 - easeOutCubic(progress));
      if (progress === 1) phaseRef.current = "hold";
      return;
    }

    const from = exitFromRef.current;
    slide.position.x = from + (travel - from) * easeInOutQuad(progress);
    if (progress === 1 && !hasExitedRef.current) {
      hasExitedRef.current = true;
      onExited();
    }
  });

  return (
    <group ref={slideRef} position-x={-viewport.width}>
      <group ref={spinRef} scale={SIZE_SCALES[size]}>
        <group rotation-z={TILT}>
          <primitive object={object} />
        </group>
      </group>
    </group>
  );
}

for (const url of Object.values(MODEL_URLS)) {
  useGLTF.preload(url);
}
