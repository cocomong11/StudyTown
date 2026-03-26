import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Character3DModel({
  skinColor,
  hairColor,
  outfitColor,
  mode = 'idle',
}) {
  const groupRef = useRef();
  const armLeftRef = useRef();
  const armRightRef = useRef();
  const headRef = useRef();

  const materials = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({
        color: skinColor || '#FDBCB4',
        metalness: 0.05,
        roughness: 0.55,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: hairColor || '#3D2010',
        metalness: 0.08,
        roughness: 0.65,
      }),
      shirt: new THREE.MeshStandardMaterial({
        color: outfitColor || '#6C8EBF',
        metalness: 0.08,
        roughness: 0.7,
      }),
      pants: new THREE.MeshStandardMaterial({
        color: '#2A2A3A',
        metalness: 0.02,
        roughness: 0.8,
      }),
      shoes: new THREE.MeshStandardMaterial({
        color: '#0F0F15',
        metalness: 0.2,
        roughness: 0.5,
      }),
      eyes: new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        metalness: 0.5,
        roughness: 0.2,
      }),
      iris: new THREE.MeshStandardMaterial({
        color: '#3366CC',
        metalness: 0.3,
        roughness: 0.3,
      }),
      cheeks: new THREE.MeshStandardMaterial({
        color: '#FFB0B0',
        metalness: 0.0,
        roughness: 0.95,
        transparent: true,
        opacity: 0.5,
      }),
    }),
    [skinColor, hairColor, outfitColor],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (mode === 'idle') {
      // 부드러운 숨결 같은 움직임
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.03;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
      if (headRef.current)
        headRef.current.rotation.z = Math.sin(t * 1.8) * 0.02;
      if (armLeftRef.current)
        armLeftRef.current.rotation.z = Math.sin(t * 1.1) * 0.15;
      if (armRightRef.current)
        armRightRef.current.rotation.z = -Math.sin(t * 1.1) * 0.15;
    } else if (mode === 'studying') {
      // 집중 상태: 고정된 자세, 미세한 움직임
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.01;
      if (armLeftRef.current) armLeftRef.current.rotation.z = 0.3;
      if (armRightRef.current) armRightRef.current.rotation.z = -0.4;
      if (headRef.current)
        headRef.current.rotation.y = Math.sin(t * 0.7) * 0.05;
    } else if (mode === 'celebrate') {
      // 축하: 활발한 움직임
      groupRef.current.position.y = Math.sin(t * 3.0) * 0.12;
      if (armLeftRef.current)
        armLeftRef.current.rotation.z = Math.sin(t * 5.0) * 0.7 - 1.2;
      if (armRightRef.current)
        armRightRef.current.rotation.z = -Math.sin(t * 5.0) * 0.7 + 1.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 머리 */}
      <group ref={headRef}>
        {/* 얼굴 기저 */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <sphereGeometry args={[0.5, 64, 64]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>

        {/* 볼 (이미지 기반) */}
        <mesh position={[-0.52, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>
        <mesh position={[0.52, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.13, 32, 32]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>

        {/* 머리카락 (상단) */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.52, 64, 32]} />
          <meshStandardMaterial {...materials.hair} />
        </mesh>

        {/* 머리카락 (양쪽) */}
        <mesh position={[-0.48, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial {...materials.hair} />
        </mesh>
        <mesh position={[0.48, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial {...materials.hair} />
        </mesh>

        {/* 눈 공백 */}
        <mesh position={[-0.18, 1.0, 0.45]} castShadow>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial {...materials.eyes} />
        </mesh>
        <mesh position={[0.18, 1.0, 0.45]} castShadow>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial {...materials.eyes} />
        </mesh>

        {/* 눈 동공 */}
        <mesh position={[-0.18, 1.0, 0.57]} castShadow>
          <sphereGeometry args={[0.09, 32, 32]} /> {/* 수정: 064 → 32 */}
          <meshStandardMaterial {...materials.iris} />
        </mesh>
        <mesh position={[0.18, 1.0, 0.57]} castShadow>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial {...materials.iris} />
        </mesh>

        {/* 눈upil (검은색) */}
        <mesh position={[-0.18, 1.0, 0.64]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color='#000000' />
        </mesh>
        <mesh position={[0.18, 1.0, 0.64]} castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color='#000000' />
        </mesh>

        {/* 눈 반사광 (높이 일치) */}
        <mesh position={[-0.18, 1.05, 0.66]} castShadow>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial
            color='#FFFFFF'
            emissive='#FFFFFF'
            emissiveIntensity={0.9}
          />
        </mesh>
        <mesh position={[0.18, 1.05, 0.66]} castShadow>
          {' '}
          {/* 수정: 0.23 → 0.18 */}
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial
            color='#FFFFFF'
            emissive='#FFFFFF'
            emissiveIntensity={0.9}
          />
        </mesh>

        {/* 코 */}
        <mesh position={[0, 0.82, 0.48]} castShadow>
          <sphereGeometry args={[0.055, 20, 20]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>

        {/* 볼색 (분홍) */}
        <mesh position={[-0.32, 0.75, 0.35]} castShadow>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial {...materials.cheeks} />
        </mesh>
        <mesh position={[0.32, 0.75, 0.35]} castShadow>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial {...materials.cheeks} />
        </mesh>

        {/* 입 */}
        <mesh position={[0, 0.62, 0.48]}>
          <boxGeometry args={[0.18, 0.05, 0.02]} />
          <meshStandardMaterial color='#DD8888' />
        </mesh>
      </group>

      {/* 목 */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.28, 32]} />
        <meshStandardMaterial {...materials.skin} />
      </mesh>

      {/* 상의 */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.42, 0.8, 0.32]} />
        <meshStandardMaterial {...materials.shirt} />
      </mesh>

      {/* 팔꿈치 패치 */}
      <mesh position={[0, 0.32, 0.18]} castShadow>
        <boxGeometry args={[0.45, 0.15, 0.08]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>

      {/* 손목 슬라이드 */}
      <mesh position={[0, 0.1, 0.17]}>
        <cylinderGeometry args={[0.06, 0.06, 0.015, 24]} />
        <meshStandardMaterial color='#555555' />
      </mesh>
      <mesh position={[0, -0.15, 0.17]}>
        <cylinderGeometry args={[0.06, 0.06, 0.015, 24]} />
        <meshStandardMaterial color='#555555' />
      </mesh>

      {/* 왼팔 */}
      <group ref={armLeftRef} position={[-0.38, 0.28, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.1, 0.38, 32]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.08, 0.38, 32]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>
        <mesh position={[0, -0.62, 0]} castShadow>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>
      </group>

      {/* 오른팔 */}
      <group ref={armRightRef} position={[0.38, 0.28, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.1, 0.38, 32]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.08, 0.38, 32]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>
        <mesh position={[0, -0.62, 0]} castShadow>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial {...materials.skin} />
        </mesh>
      </group>

      {/* 왼다리 */}
      <mesh position={[-0.16, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.11, 0.75, 32]} />
        <meshStandardMaterial {...materials.pants} />
      </mesh>

      {/* 오른다리 */}
      <mesh position={[0.16, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.11, 0.75, 32]} />
        <meshStandardMaterial {...materials.pants} />
      </mesh>

      {/* 왼발 */}
      <mesh position={[-0.16, -1.0, 0.1]} castShadow>
        <boxGeometry args={[0.25, 0.18, 0.36]} />
        <meshStandardMaterial {...materials.shoes} />
      </mesh>

      {/* 오른발 */}
      <mesh position={[0.16, -1.0, 0.1]} castShadow>
        <boxGeometry args={[0.25, 0.18, 0.36]} />
        <meshStandardMaterial {...materials.shoes} />
      </mesh>
    </group>
  );
}

export default function Character3D({
  customization,
  mode = 'idle',
  size = 300,
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)',
      }}
    >
      <Canvas camera={{ position: [0, 0.2, 2.4], fov: 48 }} shadows>
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.1}
          castShadow
          shadowMapSize={2048}
        />
        <directionalLight position={[-4, 3, -5]} intensity={0.6} />
        <pointLight position={[0, 2.5, 2]} intensity={0.4} />
        <pointLight position={[0, -1, 0]} intensity={0.2} color='#8B9DC3' />

        <Character3DModel
          skinColor={customization?.skinColor}
          hairColor={customization?.hairColor}
          outfitColor={customization?.outfitColor}
          mode={mode}
        />

        {/* 사용자 조작 가능하게 수정 */}
        <OrbitControls
          autoRotate={false} // 자동 회전 끔
          enableZoom={true} // 줌 가능
          enablePan={true} // 팬 가능
          rotateSpeed={0.5} // 회전 속도 조절
          zoomSpeed={1.0}
          panSpeed={0.5}
        />

        {/* 바닥 */}
        <mesh position={[0, -1.15, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial
            color='#f5f5f0'
            metalness={0}
            roughness={0.85}
          />
        </mesh>
      </Canvas>
    </div>
  );
}
