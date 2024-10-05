import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BeaconData } from './DataParsing';

interface ModelProps {
  currentBeaconData: BeaconData;
  nextBeaconData: BeaconData;
}

export const Model: React.FC<ModelProps> = ({ currentBeaconData, nextBeaconData }) => {
  const gltf = useGLTF('/beacon_model.gltf');
  const groupRef = useRef<THREE.Group>(null!);

  const [rotation, setRotation] = useState({
    yaw: currentBeaconData.rotation.yaw,
    pitch: currentBeaconData.rotation.pitch,
    roll: currentBeaconData.rotation.roll,
  });

  useEffect(() => {
    setRotation({
      yaw: currentBeaconData.rotation.yaw,
      pitch: currentBeaconData.rotation.pitch,
      roll: currentBeaconData.rotation.roll,
    });
  }, [currentBeaconData]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Interpolate between current and next rotation values
      const newYaw = THREE.MathUtils.lerp(
        rotation.yaw,
        nextBeaconData.rotation.yaw,
        delta * 5 // Adjust the speed of interpolation
      );
      const newPitch = THREE.MathUtils.lerp(
        rotation.pitch,
        nextBeaconData.rotation.pitch,
        delta * 5
      );
      const newRoll = THREE.MathUtils.lerp(
        rotation.roll,
        nextBeaconData.rotation.roll,
        delta * 5
      );

      // Update the rotation state
      setRotation({ yaw: newYaw, pitch: newPitch, roll: newRoll });

      // Apply the interpolated rotation to the model
      groupRef.current.rotation.set(
        THREE.MathUtils.degToRad(newPitch),
        THREE.MathUtils.degToRad(newYaw),
        THREE.MathUtils.degToRad(newRoll)
      );
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} />
    </group>
  );
};