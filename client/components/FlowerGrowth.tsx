import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Text, OrbitControls, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { animated, useSpring, config } from '@react-spring/three';

// Extend Three.js materials for react-spring
extend({ 
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  CylinderGeometry: THREE.CylinderGeometry,
  SphereGeometry: THREE.SphereGeometry,
  PlaneGeometry: THREE.PlaneGeometry
});

interface FlowerGrowthProps {
  percentage: number;
  onFlowerClick?: () => void;
  disabled?: boolean;
  showTooltip?: boolean;
  className?: string;
}

interface GrowthStage {
  name: string;
  stemHeight: number;
  stemRadius: number;
  leafCount: number;
  leafScale: number;
  budScale: number;
  petalCount: number;
  petalScale: number;
  bloomAnimation: boolean;
  particleCount: number;
}

// Growth stage definitions
const getGrowthStage = (percentage: number): GrowthStage => {
  if (percentage === 0) {
    return {
      name: 'seed',
      stemHeight: 0,
      stemRadius: 0,
      leafCount: 0,
      leafScale: 0,
      budScale: 0,
      petalCount: 0,
      petalScale: 0,
      bloomAnimation: false,
      particleCount: 0
    };
  } else if (percentage <= 25) {
    return {
      name: 'sprout',
      stemHeight: 0.5,
      stemRadius: 0.02,
      leafCount: 0,
      leafScale: 0,
      budScale: 0,
      petalCount: 0,
      petalScale: 0,
      bloomAnimation: false,
      particleCount: 0
    };
  } else if (percentage <= 50) {
    return {
      name: 'small-plant',
      stemHeight: 1.0,
      stemRadius: 0.03,
      leafCount: 2,
      leafScale: 0.6,
      budScale: 0,
      petalCount: 0,
      petalScale: 0,
      bloomAnimation: false,
      particleCount: 0
    };
  } else if (percentage <= 75) {
    return {
      name: 'growing',
      stemHeight: 1.5,
      stemRadius: 0.04,
      leafCount: 3,
      leafScale: 0.8,
      budScale: 0.3,
      petalCount: 0,
      petalScale: 0,
      bloomAnimation: false,
      particleCount: 0
    };
  } else if (percentage < 100) {
    return {
      name: 'blooming',
      stemHeight: 2.0,
      stemRadius: 0.05,
      leafCount: 4,
      leafScale: 1.0,
      budScale: 0.1,
      petalCount: 6,
      petalScale: 0.7,
      bloomAnimation: false,
      particleCount: 5
    };
  } else {
    return {
      name: 'full-bloom',
      stemHeight: 2.2,
      stemRadius: 0.05,
      leafCount: 4,
      leafScale: 1.0,
      budScale: 0,
      petalCount: 8,
      petalScale: 1.0,
      bloomAnimation: true,
      particleCount: 12
    };
  }
};

// Seed component
const Seed: React.FC<{ visible: boolean }> = ({ visible }) => {
  return visible ? (
    <mesh position={[0, 0.05, 0]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="#8B4513" roughness={0.8} />
    </mesh>
  ) : null;
};

// Stem component
const Stem: React.FC<{ height: number; radius: number }> = ({ height, radius }) => {
  const meshRef = useRef<THREE.Mesh>();

  const props = useSpring({
    scale: height > 0 ? [1, height, 1] : [0, 0, 0],
    config: config.gentle
  });

  return height > 0 ? (
    <animated.mesh
      ref={meshRef}
      position={[0, height / 2, 0]}
      scale={props.scale}
    >
      <cylinderGeometry args={[radius, radius * 1.2, 1, 8]} />
      <meshStandardMaterial 
        color="#228B22" 
        roughness={0.6}
        metalness={0.1}
      />
    </animated.mesh>
  ) : null;
};

// Leaf component
const Leaf: React.FC<{ position: [number, number, number]; rotation: [number, number, number]; scale: number }> = ({ 
  position, 
  rotation, 
  scale 
}) => {
  const meshRef = useRef<THREE.Mesh>();

  const props = useSpring({
    scale: scale > 0 ? [scale, scale, scale] : [0, 0, 0],
    config: config.wobbly
  });

  // Create leaf shape using a custom geometry
  const leafGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.2, 0.1, 0.4, 0.3);
    shape.quadraticCurveTo(0.3, 0.5, 0, 0.6);
    shape.quadraticCurveTo(-0.3, 0.5, -0.4, 0.3);
    shape.quadraticCurveTo(-0.2, 0.1, 0, 0);
    
    const extrudeSettings = {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.01,
      bevelThickness: 0.01
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return scale > 0 ? (
    <animated.mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={props.scale}
      geometry={leafGeometry}
    >
      <meshStandardMaterial 
        color="#32CD32" 
        roughness={0.7}
        metalness={0.1}
      />
    </animated.mesh>
  ) : null;
};

// Petal component
const Petal: React.FC<{ 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  scale: number;
  color: string;
}> = ({ position, rotation, scale, color }) => {
  const meshRef = useRef<THREE.Mesh>();

  const props = useSpring({
    scale: scale > 0 ? [scale, scale, scale] : [0, 0, 0],
    config: config.wobbly
  });

  // Create petal shape
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.3, 0.2, 0.4, 0.6);
    shape.quadraticCurveTo(0.2, 0.8, 0, 0.7);
    shape.quadraticCurveTo(-0.2, 0.8, -0.4, 0.6);
    shape.quadraticCurveTo(-0.3, 0.2, 0, 0);
    
    const extrudeSettings = {
      depth: 0.03,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 2,
      bevelSize: 0.02,
      bevelThickness: 0.01
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return scale > 0 ? (
    <animated.mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={props.scale}
      geometry={petalGeometry}
    >
      <meshStandardMaterial 
        color={color}
        roughness={0.3}
        metalness={0.2}
      />
    </animated.mesh>
  ) : null;
};

// Particle system for celebration
const ParticleSystem: React.FC<{ count: number; animate: boolean }> = ({ count, animate }) => {
  const meshRef = useRef<THREE.InstancedMesh>();
  const [positions] = useState(() => 
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 4,
      y: Math.random() * 3 + 1,
      z: (Math.random() - 0.5) * 4,
      speed: Math.random() * 0.02 + 0.01
    }))
  );

  useFrame((state) => {
    if (!meshRef.current || !animate) return;

    positions.forEach((pos, i) => {
      pos.y += pos.speed;
      if (pos.y > 4) {
        pos.y = 0;
        pos.x = (Math.random() - 0.5) * 4;
        pos.z = (Math.random() - 0.5) * 4;
      }

      const matrix = new THREE.Matrix4();
      matrix.setPosition(pos.x, pos.y, pos.z);
      meshRef.current!.setMatrixAt(i, matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return count > 0 ? (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
    >
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshStandardMaterial 
        color="#FFD700"
        emissive="#FFA500"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  ) : null;
};

// Flower pot component
const FlowerPot: React.FC = () => {
  return (
    <group>
      {/* Pot body */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.4, 12]} />
        <meshStandardMaterial 
          color="#D2691E" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.42, 0.4, 0.05, 12]} />
        <meshStandardMaterial 
          color="#A0522D" 
          roughness={0.8}
        />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 12]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};

// Main 3D Flower Scene
const FlowerScene: React.FC<{ 
  percentage: number; 
  onClick?: () => void; 
  showCelebration: boolean;
  onCelebrationComplete: () => void;
}> = ({ percentage, onClick, showCelebration, onCelebrationComplete }) => {
  const groupRef = useRef<THREE.Group>();
  const stage = getGrowthStage(percentage);
  
  // Celebration animation
  useEffect(() => {
    if (showCelebration && stage.name === 'full-bloom') {
      const timeout = setTimeout(onCelebrationComplete, 1500);
      return () => clearTimeout(timeout);
    }
  }, [showCelebration, stage.name, onCelebrationComplete]);

  // Gentle floating animation for full bloom
  const { rotation } = useSpring({
    rotation: stage.bloomAnimation ? [0, Math.PI * 2, 0] : [0, 0, 0],
    config: { duration: 8000 },
    loop: stage.bloomAnimation
  });

  // Create leaves positions
  const leafPositions: Array<{
    position: [number, number, number];
    rotation: [number, number, number];
  }> = useMemo(() => {
    const positions = [];
    for (let i = 0; i < stage.leafCount; i++) {
      const angle = (i / stage.leafCount) * Math.PI * 2;
      const height = 0.3 + (i * 0.3);
      positions.push({
        position: [
          Math.cos(angle) * 0.3,
          height,
          Math.sin(angle) * 0.3
        ] as [number, number, number],
        rotation: [
          Math.PI / 2,
          angle,
          Math.sin(i * 0.5) * 0.2
        ] as [number, number, number]
      });
    }
    return positions;
  }, [stage.leafCount]);

  // Create petal positions
  const petalPositions: Array<{
    position: [number, number, number];
    rotation: [number, number, number];
    color: string;
  }> = useMemo(() => {
    const positions = [];
    const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'];
    for (let i = 0; i < stage.petalCount; i++) {
      const angle = (i / stage.petalCount) * Math.PI * 2;
      positions.push({
        position: [
          Math.cos(angle) * 0.2,
          stage.stemHeight + 0.1,
          Math.sin(angle) * 0.2
        ] as [number, number, number],
        rotation: [
          Math.PI / 2,
          angle,
          0
        ] as [number, number, number],
        color: colors[i % colors.length]
      });
    }
    return positions;
  }, [stage.petalCount, stage.stemHeight]);

  return (
    <animated.group 
      ref={groupRef} 
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Flower Pot */}
      <FlowerPot />
      
      {/* Seed (only visible at 0%) */}
      <Seed visible={stage.name === 'seed'} />
      
      {/* Stem */}
      <Stem height={stage.stemHeight} radius={stage.stemRadius} />
      
      {/* Leaves */}
      {leafPositions.map((leaf, index) => (
        <Leaf
          key={index}
          position={leaf.position}
          rotation={leaf.rotation}
          scale={stage.leafScale}
        />
      ))}
      
      {/* Bud (before full bloom) */}
      {stage.budScale > 0 && (
        <mesh position={[0, stage.stemHeight + 0.1, 0]}>
          <sphereGeometry args={[0.15 * stage.budScale, 8, 8]} />
          <meshStandardMaterial 
            color="#90EE90"
            roughness={0.6}
          />
        </mesh>
      )}
      
      {/* Petals */}
      {petalPositions.map((petal, index) => (
        <Petal
          key={index}
          position={petal.position}
          rotation={petal.rotation}
          scale={stage.petalScale}
          color={petal.color}
        />
      ))}
      
      {/* Flower center */}
      {stage.petalCount > 0 && (
        <mesh position={[0, stage.stemHeight + 0.1, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color="#FFD700"
            emissive="#FFA500"
            emissiveIntensity={showCelebration ? 0.5 : 0.2}
          />
        </mesh>
      )}
      
      {/* Celebration particles */}
      <ParticleSystem 
        count={stage.particleCount} 
        animate={showCelebration || stage.bloomAnimation}
      />
      
      {/* Gentle glow for full bloom */}
      {stage.name === 'full-bloom' && (
        <pointLight
          position={[0, stage.stemHeight + 0.5, 0]}
          color="#FFB6C1"
          intensity={0.3}
          distance={2}
          decay={2}
        />
      )}
    </animated.group>
  );
};

// Main FlowerGrowth component
const FlowerGrowth: React.FC<FlowerGrowthProps> = ({ 
  percentage, 
  onFlowerClick,
  disabled = false,
  showTooltip = true,
  className = ""
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastPercentage, setLastPercentage] = useState(percentage);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setIsWebGLSupported(!!gl);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Trigger celebration when reaching 100%
  useEffect(() => {
    if (percentage === 100 && lastPercentage < 100 && !prefersReducedMotion) {
      setShowCelebration(true);
    }
    setLastPercentage(percentage);
  }, [percentage, lastPercentage, prefersReducedMotion]);

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  const handleFlowerClick = () => {
    if (!disabled && onFlowerClick) {
      onFlowerClick();
    }
  };

  const stage = getGrowthStage(percentage);
  const tooltip = `Your flower is ${percentage}% grown - keep going!`;

  // Fallback for when WebGL is not supported
  if (!isWebGLSupported) {
    return <div className="text-center text-gray-500">3D not supported, loading fallback...</div>;
  }

  return (
    <div 
      className={`relative ${className}`}
      style={{ height: '200px', width: '100%' }}
      title={showTooltip ? tooltip : undefined}
      aria-label={tooltip}
      role="img"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          handleFlowerClick();
        }
      }}
    >
      <Canvas
        camera={{ position: [0, 2, 3], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        performance={{ min: 0.8 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight 
          position={[-3, 2, -3]} 
          intensity={0.3} 
        />
        
        {!prefersReducedMotion && <Environment preset="park" />}
        
        <FlowerScene 
          percentage={percentage}
          onClick={handleFlowerClick}
          showCelebration={showCelebration}
          onCelebrationComplete={handleCelebrationComplete}
        />
        
        {!disabled && !prefersReducedMotion && (
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            autoRotate={stage.name === 'full-bloom'}
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>
      
      {/* Screen reader text */}
      <div className="sr-only">
        Flower growth visualization showing {stage.name} stage at {percentage}% completion
      </div>
    </div>
  );
};

export default FlowerGrowth;