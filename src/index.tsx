import { OrbitControls, useBounds, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import './styles.css'; // Ensure you import your CSS

// Component to load and display the GLTF model and fit it to the screen
const Model = () => {
  const gltf = useGLTF('/beacon_model.gltf'); // Ensure the path to the model is correct

  // Set the ref type to THREE.Group and initialize with null
  const groupRef = useRef<THREE.Group>(null!); 
  const bounds = useBounds();

  // Automatically fit the model into the view when it loads
  useEffect(() => {
    if (groupRef.current && bounds) {
      bounds.refresh(groupRef.current).fit(); // Fit the model into the view
    }
  }, [gltf, bounds]);
  
  // Animate the model to move along the x-axis
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * 0.5; // Adjust the speed as needed
    }
  });

  return (
    <group ref={groupRef}>
      {/* Adjust the scale to make the model smaller */}
      <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} />
    </group>
  );
};

// Component for drawing grids and axes representing longitude, latitude, and altitude
const Grids = () => {
  return (
    <>
      {/* Longitude and Latitude Grid (X-Z plane) */}
      <gridHelper args={[100, 100]} position={[0, 0, 0]} rotation={[0, 0, 0]} />

      {/* Altitude Grid (Y axis lines) */}
      <gridHelper args={[100, 100]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />

      {/* Axes Helper for X, Y, Z (longitude, latitude, altitude) */}
      <axesHelper args={[50]} />
    </>
  );
};


// Main App Component
const App = () => {
  return (
    <Canvas>
      {/* Basic lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      {/* Load the GLTF model */}
      <Model />

      {/* Orbit Controls to navigate the scene */}
      <OrbitControls />

       {/* Add grids and axes for longitude, latitude, and altitude */}
       <Grids />

      {/* UseBounds from @react-three/drei to auto-adjust the view */}
    </Canvas>
  );
};

// Render the App
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

// If you are using TypeScript, add this for GLTF loader typing
useGLTF.preload('/beacon_model.gltf');