import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Floor({ floorIndex, isRed }) {
    const baseColor = isRed ? '#ef4444' : '#06b6d4';
    const floorY = floorIndex * 1.5; // space them vertically

    // 5 Flats per floor arranged in a cross
    const flats = [
        { x: 0, z: 0 },       // Center Flat
        { x: -1.6, z: 0 },    // Left Flat
        { x: 1.6, z: 0 },     // Right Flat
        { x: 0, z: -1.6 },    // Back Flat
        { x: 0, z: 1.6 },     // Front Flat
    ];

    return (
        <group position={[0, floorY, 0]}>
            {/* Floor Base Plate */}
            <mesh position={[0, -0.6, 0]}>
                <boxGeometry args={[4.8, 0.1, 4.8]} />
                <meshBasicMaterial color={baseColor} wireframe={true} transparent opacity={0.2} />
            </mesh>

            {/* The 5 Flats on this floor */}
            {flats.map((pos, idx) => (
                <mesh key={idx} position={[pos.x, 0, pos.z]}>
                    <boxGeometry args={[1.4, 1.1, 1.4]} />
                    <meshBasicMaterial color={baseColor} wireframe={true} transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    );
}

function ComplexStructure({ isRed }) {
    const groupRef = useRef();

    useFrame((state) => {
        // Spin the model slowly
        groupRef.current.rotation.y += 0.005;
        // Add a slight bobbing effect
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    });

    const floors = [0, 1, 2, 3, 4]; // 5 Floors

    return (
        <group ref={groupRef} position={[0, -2.5, 0]}>
            {/* Ground Grid projection effect */}
            <mesh position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[15, 15, 30, 30]} />
                <meshBasicMaterial color={isRed ? '#7f1d1d' : '#0891b2'} wireframe={true} transparent opacity={0.2} />
            </mesh>

            {/* Central Core / Elevator Shaft giving structural support */}
            <mesh position={[0, 3, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 7.5, 16]} />
                <meshBasicMaterial color={isRed ? '#fca5a5' : '#7dd3fc'} wireframe={true} transparent opacity={0.3} />
            </mesh>

            {/* Render 5 Floors */}
            {floors.map(floorIndex => (
                <Floor key={floorIndex} floorIndex={floorIndex} isRed={isRed} />
            ))}
        </group>
    );
}

export default function ThreeDBuilding({ isAnomaly }) {
    return (
        <div className="w-full h-full relative cursor-move">
            <Canvas camera={{ position: [8, 6, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color={isAnomaly ? '#ef4444' : '#06b6d4'} />

                <ComplexStructure isRed={isAnomaly} />

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 2 + 0.1} // Prevent looking completely under
                    minDistance={5}
                    maxDistance={20}
                />
            </Canvas>
        </div>
    );
}
