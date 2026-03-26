import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ============ 카페 건물 ============
function CafeBuilding() {
  return (
    <group>
      {/* 벽 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[3, 2.5, 2.5]} />
        <meshStandardMaterial color='#E8D4B0' metalness={0.05} roughness={0.7} />
      </mesh>
      {/* 지붕 */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[2.2, 1, 4]} />
        <meshStandardMaterial color='#8B4513' metalness={0.08} roughness={0.6} />
      </mesh>
      {/* 창문들 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[-1 + i * 0.8, 0.8, 1.3]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color='#FFE680' emissive='#FFCC00' emissiveIntensity={0.6} />
        </mesh>
      ))}
      {/* 입구 */}
      <mesh position={[0, 0.3, 1.4]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.1]} />
        <meshStandardMaterial color='#4A3728' metalness={0.3} roughness={0.4} />
      </mesh>
      {/* 간판 */}
      <mesh position={[0, 2.2, 1.4]}>
        <boxGeometry args={[1.5, 0.4, 0.1]} />
        <meshStandardMaterial color='#D4533F' emissive='#FF6B4A' emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

// ============ 도서관 건물 ============
function LibraryBuilding() {
  return (
    <group>
      {/* 본체 */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[2.5, 3.5, 2]} />
        <meshStandardMaterial color='#B0A890' metalness={0.05} roughness={0.75} />
      </mesh>
      {/* 지붕 */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[2.7, 0.3, 2.2]} />
        <meshStandardMaterial color='#5A4A3A' metalness={0.08} roughness={0.6} />
      </mesh>
      {/* 윈도우 그리드 */}
      {Array.from({ length: 3 }).map((_, x) =>
        Array.from({ length: 3 }).map((_, y) => (
          <mesh key={x + y * 3} position={[-0.8 + x * 0.8, 0.3 + y * 0.8, 1.1]} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial color='#4A90E2' emissive='#3366CC' emissiveIntensity={0.5} />
          </mesh>
        ))
      )}
      {/* 입구 기둥 */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 1.2]}>
          <cylinderGeometry args={[0.15, 0.15, 1.5, 8]} />
          <meshStandardMaterial color='#6B5D4F' metalness={0.1} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ============ 공원 카페 ============
function ParkCafeBuilding() {
  return (
    <group>
      {/* 캐노피 */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2, 0.15, 2.5]} />
        <meshStandardMaterial color='#E8A040' metalness={0.1} roughness={0.65} />
      </mesh>
      {/* 기둥들 */}
      {[-0.8, 0.8].map((x, i) =>
        [-0.8, 0.8].map((z, j) => (
          <mesh key={i + j * 2} position={[x, 0.5, z]}>
            <cylinderGeometry args={[0.12, 0.12, 1.3, 8]} />
            <meshStandardMaterial color='#8B6030' metalness={0.08} roughness={0.7} />
          </mesh>
        ))
      )}
      {/* 테이블 */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 8]} />
        <meshStandardMaterial color='#6B5D4F' metalness={0.15} roughness={0.6} />
      </mesh>
      {/* 나무 */}
      <mesh position={[-1.2, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.2, 8]} />
        <meshStandardMaterial color='#4A3010' />
      </mesh>
      <mesh position={[-1.2, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color='#2D5A2D' metalness={0.02} roughness={0.8} />
      </mesh>
    </group>
  );
}

// ============ 영화관 건물 ============
function CinemaBuilding() {
  return (
    <group>
      {/* 본체 */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[2.8, 2.5, 2.2]} />
        <meshStandardMaterial color='#1A1A2E' metalness={0.1} roughness={0.8} />
      </mesh>
      {/* 창문 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[-1 + i * 1, 0.8, 1.2]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.1]} />
          <meshStandardMaterial color='#1A0000' emissive='#CC0000' emissiveIntensity={0.8} />
        </mesh>
      ))}
      {/* 간판 */}
      <mesh position={[0, 1.8, 1.2]}>
        <boxGeometry args={[2, 0.5, 0.1]} />
        <meshStandardMaterial color='#FF0000' emissive='#FF6600' emissiveIntensity={0.9} />
      </mesh>
      {/* 입구 */}
      <mesh position={[0, 0.4, 1.3]}>
        <boxGeometry args={[1, 1.2, 0.1]} />
        <meshStandardMaterial color='#0A0A0A' />
      </mesh>
    </group>
  );
}

// ============ 오피스 건물 ============
function OfficeBuilding() {
  return (
    <group>
      {/* 본체 */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.5, 3, 2]} />
        <meshStandardMaterial color='#DCE8F0' metalness={0.08} roughness={0.7} />
      </mesh>
      {/* 지붕 */}
      <mesh position={[0, 2.15, 0]}>
        <boxGeometry args={[2.7, 0.3, 2.2]} />
        <meshStandardMaterial color='#7A8AAA' metalness={0.1} roughness={0.65} />
      </mesh>
      {/* 윈도우 그리드 */}
      {Array.from({ length: 4 }).map((_, x) =>
        Array.from({ length: 3 }).map((_, y) => (
          <mesh key={x + y * 4} position={[-1 + x * 0.7, 0.4 + y * 0.7, 1.1]}>
            <boxGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial color='#2A6AA0' emissive='#1A4A80' emissiveIntensity={0.6} />
          </mesh>
        ))
      )}
    </group>
  );
}

// ============ 루프탑 건물 ============
function RooftopBuilding() {
  return (
    <group>
      {/* 본체 */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[2.5, 2, 2.5]} />
        <meshStandardMaterial color='#0D1A30' metalness={0.08} roughness={0.75} />
      </mesh>
      {/* 루프탑 난간 */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[2.7, 0.2, 2.7]} />
        <meshStandardMaterial color='#2D3A5A' />
      </mesh>
      {/* 조명들 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.2, 1.2, Math.sin(angle) * 1.2]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color='#FFE680' emissive='#FFD700' emissiveIntensity={0.95} />
          </mesh>
        );
      })}
      {/* 달 */}
      <mesh position={[0.5, 2, -1.5]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color='#FFFACD' emissive='#FFFFE0' emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

const buildingComponents = {
  cafe: CafeBuilding,
  library: LibraryBuilding,
  park: ParkCafeBuilding,
  cinema: CinemaBuilding,
  office: OfficeBuilding,
  rooftop: RooftopBuilding,
};

export default function Building3D({ buildingId = 'cafe', size = 300 }) {
  const BuildingComp = buildingComponents[buildingId] || CafeBuilding;

  return (
    <div style={{ width: size, height: size, borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)' }}>
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 8, 5]} intensity={1.2} castShadow shadowMapSize={2048} />
        <pointLight position={[0, 2, 0]} intensity={0.5} />
        <pointLight position={[-3, 1, -3]} intensity={0.3} color='#4A90E2' />

        <BuildingComp />

        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} enablePan={false} />

        <mesh position={[0, -0.8, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color='#0A1020' metalness={0} roughness={0.9} />
        </mesh>
      </Canvas>
    </div>
  );
}
