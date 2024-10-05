import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BeaconData } from './DataParsing';

interface ModelProps {
  beaconData: BeaconData;
}

export const Model: React.FC<ModelProps> = ({ beaconData }) => {
  const gltf = useGLTF('/beacon_model.gltf');
  const groupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    if (groupRef.current) {
      console.log("Group ref is available!");

      // Set the position using the parsed location
      const { latitude, longitude, altitude } = beaconData.location;
      const position = convertLatLonAltToXYZ(latitude, longitude, altitude);
      console.log(position);
      groupRef.current.position.set(position.x, position.y, position.z);

      // Set the rotation using the parsed yaw, pitch, roll
      const { yaw, pitch, roll } = beaconData.rotation;
      console.log("Rotation:", { yaw, pitch, roll });

      groupRef.current.rotation.set(
        THREE.MathUtils.degToRad(pitch),
        THREE.MathUtils.degToRad(yaw),
        THREE.MathUtils.degToRad(roll)
      );
    } else {
      console.warn("groupRef.current not available yet.");
    }
  }, [gltf, beaconData]);

  // Animate the model to move along the x-axis
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * 2.0; // Adjust the speed as needed
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} />
    </group>
  );
};

// Helper function to convert lat/lon/alt to Cartesian coordinates (simplified)
function convertLatLonAltToXYZ(lat: number, lon: number, alt: number) {
  const radius = 6371 + alt; // Earth's radius + altitude in kilometers
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return { x, y, z };
}