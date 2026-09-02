'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function PerfumeBottle() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    // Subtle mouse follow
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.1,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -pointer.x * 0.05,
      0.05
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* Bottle Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.7, 2.2, 32, 1, false]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={512}
            transmission={0.95}
            roughness={0.05}
            thickness={0.5}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropy={0.1}
            distortion={0.0}
            distortionScale={0.3}
            temporalDistortion={0.0}
            color="#E8D0F0"
          />
        </mesh>

        {/* Bottle Neck */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.2, 0.35, 0.8, 32]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={512}
            transmission={0.9}
            roughness={0.05}
            thickness={0.3}
            ior={1.5}
            color="#D8C0E8"
          />
        </mesh>

        {/* Cap */}
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.6, 32]} />
          <meshStandardMaterial
            color="#4B1D63"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Cap Top */}
        <mesh position={[0, 2.55, 0]}>
          <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#4B1D63"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Liquid inside */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 1.5, 32]} />
          <meshStandardMaterial
            color="#9B59B6"
            transparent
            opacity={0.4}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>

        {/* Label area - frosted band */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.62, 0.72, 0.6, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            opacity={0.15}
            roughness={0.9}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Particles() {
  const count = 60;
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        speed: 0.2 + Math.random() * 0.5,
        scale: 0.02 + Math.random() * 0.03,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();
    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed;
      dummy.position.set(
        particle.position.x + Math.sin(t) * 0.3,
        particle.position.y + Math.cos(t * 0.7) * 0.3,
        particle.position.z + Math.sin(t * 0.5) * 0.3
      );
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#C7A7E8"
        transparent
        opacity={0.5}
        emissive="#C7A7E8"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#F5F0E8" />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#C7A7E8" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#9B59B6" />
      
      <PerfumeBottle />
      <Particles />

      <Environment preset="studio" environmentIntensity={0.3} />
    </Canvas>
  );
}
