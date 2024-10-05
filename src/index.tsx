import { OrbitControls, useBounds, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import './styles.css'; // Ensure you import your CSS

// Generate an array of random 3D points
const generateRandomPoints = (numPoints: number) => {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const longitude = Math.random() * 100 - 50; // X axis (longitude)
    const latitude = Math.random() * 100 - 50;  // Z axis (latitude)
    const altitude = Math.random() * 50;        // Y axis (altitude)
    points.push(new THREE.Vector3(longitude, altitude, latitude));
  }
  return points;
};


// Component to display the points in 3D space
const DisplayPoints = ({ points }: { points: THREE.Vector3[] }) => {
  return (
    <>
      {points.map((point, index) => (
        <mesh key={index} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.5, 16, 16]} /> {/* Small sphere for each point */}
          <meshStandardMaterial color="red" />
        </mesh>
      ))}
    </>
  );
};


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
   // Use useMemo to generate random points once and memoize them
   const randomPoints = useMemo(() => generateRandomPoints(100), []); // Generate 100 random points

  return (
    <Canvas>
      {/* Basic lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      {/* Display the randomly generated points */}
      <DisplayPoints points={randomPoints} />

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