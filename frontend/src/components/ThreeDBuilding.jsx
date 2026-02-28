import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Wireframe } from '@react-three/drei';

function ComplexStructure({ isRed }) {
    const groupRef = useRef();

    useFrame((state) => {
        // Spin the model slowly
        groupRef.current.rotation.y += 0.005;
        // Add a slight bobbing effect
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    });

    const baseColor = isRed ? '#ef4444' : '#06b6d4'; // Red vs Cyan

    return (
        <group ref={groupRef} position={[0, -1.5, 0]}>
            {/* Central Core */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[1, 1, 4, 16]} />
                <meshBasicMaterial color={baseColor} wireframe={true} wireframeLinewidth={2} transparent opacity={0.6} />
            </mesh>

            {/* Main Blocks */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[3, 2, 3]} />
                <meshBasicMaterial color={baseColor} wireframe={true} wireframeLinewidth={1} transparent opacity={0.4} />
            </mesh>

            <mesh position={[0, 3, 0]}>
                <boxGeometry args={[2.5, 2, 2.5]} />
                <meshBasicMaterial color={baseColor} wireframe={true} wireframeLinewidth={1} transparent opacity={0.5} />
            </mesh>

            <mesh position={[0, 4.5, 0]}>
                <boxGeometry args={[1.5, 1, 1.5]} />
                <meshBasicMaterial color={baseColor} wireframe={true} wireframeLinewidth={1} transparent opacity={0.8} />
            </mesh>

            {/* Structural Beams */}
            {[
                [-1.5, 1, -1.5], [1.5, 1, -1.5], [-1.5, 1, 1.5], [1.5, 1, 1.5],
            ].map((pos, index) => (
                <mesh key={index} position={pos}>
                    <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
                    <meshBasicMaterial color={isRed ? '#fca5a5' : '#7dd3fc'} wireframe={true} />
                </mesh>
            ))}

            {/* Ground Grid projection effect */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[10, 10, 20, 20]} />
                <meshBasicMaterial color={isRed ? '#7f1d1d' : '#0891b2'} wireframe={true} transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

export default function ThreeDBuilding({ isAnomaly }) {
    return (
        <div className="w-full h-full relative cursor-move">
            <Canvas camera={{ position: [5, 5, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color={isAnomaly ? '#ef4444' : '#06b6d4'} />

                <ComplexStructure isRed={isAnomaly} />

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    autoRotate={false}
                    maxPolarAngle={Math.PI / 2 + 0.1} // Prevent looking completely under
                    minDistance={4}
                    maxDistance={15}
                />
            </Canvas>
        </div>
    );
}
