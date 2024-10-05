import { Html, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import * as THREE from 'three';
import { Model } from './Beacon'; // Ensure you have Model in components
import { BeaconData, parseMessage } from './DataParsing'; // Import your parser
import { Grids } from './Grid'; // Ensure Grids is also moved to components

const App = () => {
  const [beaconDataArray, setBeaconDataArray] = useState<BeaconData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(1000); // State to store the slider value (in milliseconds)
  const [chartData, setChartData] = useState<any[]>([]); // State for chart data
  const [points, setPoints] = useState<THREE.Vector3[]>([]);

  // Fetch and parse the messages from the text file
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/updated_beacon_output.txt'); // Ensure the file is in the public directory
        const text = await response.text();
        
        // Split the content into individual messages using "Message " as the delimiter
        const rawMessages = text.split("Message ").slice(1).map(msg => "Message " + msg.trim());

        // Parse each message and filter out null results
        const parsedMessages = rawMessages
          .map(message => parseMessage(message))
          .filter((data): data is BeaconData => data !== null); // TypeScript narrowing to ensure non-null

        console.log('Parsed messages:', parsedMessages);
        setBeaconDataArray(parsedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  // Update the current index to iterate through the messages
  useEffect(() => {
    if (beaconDataArray.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % beaconDataArray.length); // Loop through messages
      }, sliderValue); // Update every 1 second (adjust as necessary)

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [beaconDataArray, sliderValue]);

  //  // Update the chart data as the currentIndex changes
   useEffect(() => {
    if (beaconDataArray.length > 0) {
      const currentData = beaconDataArray[currentIndex];
      setChartData((prevData) => [
        ...prevData,
        {
          index: currentIndex,
          longitude: currentData.location.longitude,
          latitude: currentData.location.latitude,
          altitude: currentData.location.altitude,
        },
      ]);
    }
  }, [currentIndex, beaconDataArray]);

   // Update the 3D points for scatter plot when the currentIndex changes
   useEffect(() => {
    if (beaconDataArray.length > 0) {
      const currentData = beaconDataArray[currentIndex];
      
      // Use the 3D coordinates directly from your data (already 3D positions)
      const newPoint = new THREE.Vector3(
        currentData.location.longitude, // x-coordinate
        currentData.location.latitude,  // y-coordinate
        currentData.location.altitude   // z-coordinate
      );
      setPoints((prevPoints) => [...prevPoints, newPoint]); // Add the new point to the list
    }
  }, [currentIndex, beaconDataArray]);

  const currentBeaconData = beaconDataArray[currentIndex];
  const nextBeaconData = beaconDataArray[(currentIndex + 1) % beaconDataArray.length];

  return (
    <div className="app-container">
      {/* Left Side: Canvas */}
      <div className="left-side">
        <Canvas>
        <group scale={[0.5, 0.5, 0.5]}>
          <Html position={[-50, 75, 0]} style={{ position: 'absolute', top: '10px', width: '100%' }}>
            <h1 style={{ color: 'white' }}>Rotation Simulation</h1>
          </Html>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />

          {/* Display the current and next message data */}
          {beaconDataArray.length > 0 && (
            <Model currentBeaconData={currentBeaconData} nextBeaconData={nextBeaconData} />
          )}

          {/* 3D Scatter Plot */}
          {points.length > 0 && (
            <ScatterPlot points={points} />
          )}

          <OrbitControls />
          <Grids />
          </group>
        </Canvas>
      </div>

      {/* Right Side: You can add other content here, or leave it empty */}
      <div className="right-side">
        {/* Optional content or leave it blank */}
        <h1>ANT61 Hackathon 2024 | TheSofwareDudes</h1>
        <div className="members">
          <p><b>Project By:</b></p>
          <p>Niklas</p>
          <p>Vergil</p>
          <p>Luis</p>
          <p>Renee</p>
          <p>Fernando</p>  
        </div>

        {/* Slider to control speed */}
        <div className="slider-container">
          <label htmlFor="speed-slider">Global Simulation Speed (ms): {sliderValue} ms</label>
          <input
            id="speed-slider"
            type="range"
            min="100" // Minimum speed (100ms)
            max="5000" // Maximum speed (5 seconds)
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))} // Update slider value
          />
        </div>

        <div className="beacon-info">
          {beaconDataArray.length > 0 && (
            <div>
              <p className="yaw">Yaw: {currentBeaconData.rotation.yaw.toFixed(2)}</p>
              <p className="pitch">Pitch: {currentBeaconData.rotation.pitch.toFixed(2)}</p>
              <p className="roll">Roll: {currentBeaconData.rotation.roll.toFixed(2)}</p>
              <p>Longitude: {currentBeaconData.location.longitude.toFixed(6)}</p>
              <p>Latitude: {currentBeaconData.location.latitude.toFixed(6)}</p>
              <p>Altitude: {currentBeaconData.location.altitude.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Chart for Longitude, Latitude, and Altitude */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="longitude" stroke="blue" />
              <Line type="monotone" dataKey="latitude" stroke="green" />
              <Line type="monotone" dataKey="altitude" stroke="red" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

// Component for 3D Scatter Plot
const ScatterPlot: React.FC<{ points: THREE.Vector3[] }> = ({ points }) => {
  return (
    <group>
      {points.map((point, index: number) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.1, 16, 16]} /> {/* Small sphere for each point */}
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}
    </group>
  );
};

export default App;