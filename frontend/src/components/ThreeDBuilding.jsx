import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import * as THREE from 'three';

function FloorPlanBlueprint({ isRed }) {
    const groupRef = useRef();

    useFrame((state) => {
        // Spin the model slowly to show the blueprint layout
        groupRef.current.rotation.y += 0.002;
    });

    const edgeColor = isRed ? '#ef4444' : '#06b6d4';
    const fillMat = isRed ? '#450a0a' : '#042f2e';
    const floorFill = isRed ? '#2a0606' : '#020617';

    // Helper to draw walls with glowing edges and dark transparent bodies
    // Height explicitly increased to make them pop more vertically
    const wallHeightMultiplier = 2.5;

    const Wall = ({ position, args }) => {
        const hPos = position[1] * wallHeightMultiplier;
        const hSize = args[1] * wallHeightMultiplier;
        return (
            <mesh position={[position[0], hPos, position[2]]}>
                <boxGeometry args={[args[0], hSize, args[2]]} />
                <meshBasicMaterial color={fillMat} transparent opacity={0.6} />
                <Edges scale={1.01} threshold={15} color={edgeColor} />
            </mesh>
        );
    };

    // Helper for wireframe furniture
    const Furniture = ({ position, args }) => (
        <mesh position={position}>
            <boxGeometry args={args} />
            <meshBasicMaterial color={edgeColor} wireframe={true} transparent opacity={0.1} />
            <Edges scale={1.01} threshold={15} color={edgeColor} opacity={0.6} transparent />
        </mesh>
    );

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            {/* Blueprint Outer Grid lines */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[50, 40, 50, 40]} />
                <meshBasicMaterial color={edgeColor} wireframe={true} transparent opacity={0.15} />
            </mesh>

            {/* Main Ground Plate */}
            <mesh position={[0, -0.05, -1]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[30, 18]} />
                <meshBasicMaterial color={floorFill} transparent opacity={0.8} />
                <Edges scale={1} threshold={15} color={edgeColor} opacity={0.4} transparent />
            </mesh>

            {/* Patio Ground */}
            <mesh position={[0, -0.08, 9]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[16, 2]} />
                <meshBasicMaterial color={floorFill} transparent opacity={0.8} />
                <Edges scale={1} threshold={15} color={edgeColor} opacity={0.4} transparent />
            </mesh>
            <mesh position={[0, -0.12, 10.5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[6, 1]} />
                <meshBasicMaterial color={floorFill} transparent opacity={0.8} />
                <Edges scale={1} threshold={15} color={edgeColor} opacity={0.4} transparent />
            </mesh>

            {/* ====== OUTSIDE WALLS ====== */}
            <Wall position={[0, 0.5, -10]} args={[30.2, 1, 0.2]} /> {/* Back Wall */}
            <Wall position={[0, 0.5, 8]} args={[30.2, 1, 0.2]} /> {/* Front Wall */}
            <Wall position={[-15, 0.5, -1]} args={[0.2, 1, 18.2]} /> {/* Left Wall */}
            <Wall position={[15, 0.5, -1]} args={[0.2, 1, 18.2]} /> {/* Right Wall */}

            {/* ====== INNER HORIZONTAL WALLS ====== */}
            <Wall position={[0, 0.5, -4]} args={[30, 1, 0.2]} /> {/* Corridor Top */}
            <Wall position={[0, 0.5, -2]} args={[30, 1, 0.2]} /> {/* Corridor Bottom */}

            {/* ====== TOP ROOMS VERTICAL WALLS ====== */}
            <Wall position={[-3, 0.5, -7]} args={[0.2, 1, 6]} />
            <Wall position={[3, 0.5, -7]} args={[0.2, 1, 6]} />
            <Wall position={[9, 0.5, -7]} args={[0.2, 1, 6]} />

            {/* ====== BOTTOM WINGS VERTICAL WALLS ====== */}
            <Wall position={[-8, 0.5, 3]} args={[0.2, 1, 10]} /> {/* Left office wall */}
            <Wall position={[8, 0.5, 3]} args={[0.2, 1, 10]} /> {/* Right lounge wall */}

            {/* ====== SMALL BATH ENCLOSURE ====== */}
            <Wall position={[-11.5, 0.5, -0.5]} args={[7, 1, 0.2]} />
            <Wall position={[-11.5, 0.5, 0.5]} args={[0.2, 1, 2]} />

            {/* ====== MIDDLE SPACE PILLARS & STAIRS ====== */}
            <Wall position={[-4, 0.5, 0]} args={[0.4, 1, 0.4]} />
            <Wall position={[4, 0.5, 0]} args={[0.4, 1, 0.4]} />
            <Wall position={[-4, 0.5, 4]} args={[0.4, 1, 0.4]} />
            <Wall position={[4, 0.5, 4]} args={[0.4, 1, 0.4]} />

            {/* Staircase (hugging the -8 wall) */}
            <mesh position={[-7.4, 0.25, 0.5]}>
                <boxGeometry args={[1, 0.5, 4]} />
                <meshBasicMaterial color={edgeColor} wireframe={true} transparent opacity={0.5} />
                <Edges scale={1.01} threshold={15} color={edgeColor} />
            </mesh>

            {/* ====== FURNITURE & APPOINTMENTS ====== */}
            {/* Kitchen & Dining (-15 to -3) */}
            <Furniture position={[-9, 0.2, -7.5]} args={[1.5, 0.4, 3.5]} /> {/* Dining Table */}
            <Furniture position={[-14, 0.2, -7]} args={[1, 0.4, 5]} /> {/* Left Counter */}
            <Furniture position={[-11, 0.2, -9.5]} args={[8, 0.4, 1]} /> {/* Back Counter */}

            {/* Bedroom 1 (-3 to 3) */}
            <Furniture position={[-0.5, 0.15, -4.8]} args={[2, 0.3, 1.5]} /> {/* Bed */}
            <Furniture position={[-1.5, 0.2, -9]} args={[2, 0.4, 1]} /> {/* Bath/Shower */}
            <Furniture position={[-2.5, 0.2, -5.5]} args={[0.8, 0.4, 1.5]} /> {/* Desk */}

            {/* Bedroom 2 (3 to 9) */}
            <Furniture position={[5.5, 0.15, -4.8]} args={[2, 0.3, 1.5]} /> {/* Bed */}
            <Furniture position={[4.5, 0.2, -9]} args={[2, 0.4, 1]} /> {/* Bath/Shower */}
            <Furniture position={[3.5, 0.2, -5.5]} args={[0.8, 0.4, 1.5]} /> {/* Desk */}

            {/* Bedroom 3 (9 to 15) */}
            <Furniture position={[11.5, 0.15, -4.8]} args={[2, 0.3, 1.5]} /> {/* Bed */}
            <Furniture position={[10.5, 0.2, -9]} args={[2, 0.4, 1]} /> {/* Bath/Shower */}
            <Furniture position={[9.5, 0.2, -5.5]} args={[0.8, 0.4, 1.5]} /> {/* Desk */}

            {/* Left Office (-15 to -8) */}
            <Furniture position={[-12.5, 0.2, 2]} args={[3, 0.4, 1.2]} /> {/* Desks */}
            <Furniture position={[-12.5, 0.2, 5]} args={[3, 0.4, 1.2]} />

            {/* Right Lounge (8 to 15) */}
            <Furniture position={[11.5, 0.2, 2.5]} args={[3, 0.4, 1]} /> {/* Couches */}
            <Furniture position={[11.5, 0.2, 5.5]} args={[3, 0.4, 1]} />
            <Furniture position={[13.5, 0.2, 4]} args={[1, 0.4, 3]} />
            <Furniture position={[9.5, 0.2, 4]} args={[1, 0.4, 3]} />
        </group>
    );
}

export default function ThreeDBuilding({ isAnomaly }) {
    return (
        <div className="w-full h-full relative cursor-move">
            <Canvas camera={{ position: [0, 25, 12], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={1} />

                <FloorPlanBlueprint isRed={isAnomaly} />

                <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 2 - 0.1} // Start with a more top-down perspective to match floorplan
                    minDistance={10}
                    maxDistance={40}
                />
            </Canvas>
        </div>
    );
}
