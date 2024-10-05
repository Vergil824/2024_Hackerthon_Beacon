// src/App.tsx

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useState } from 'react';
import { Model } from './Beacon'; // Ensure you have Model in components
import { BeaconData, parseMessage } from './DataParsing'; // Import your parser
import { Grids } from './Grid'; // Ensure Grids is also moved to components

const App: React.FC = () => {
  const [beaconData, setBeaconData] = useState<BeaconData | null>(null); // Store only the current message
  const [messageIndex, setMessageIndex] = useState(0); // Track the current message index
  const [messageArray, setMessageArray] = useState<string[]>([]); // Store all messages

  // Load the file content once
  useEffect(() => {
    const fetchBeaconData = async () => {
      try {
        const response = await fetch('../updated_beacon_output.txt'); // Adjust this path
        const fileContent = await response.text();
        
        // Split the content into individual messages based on "Message" keyword
        const messages = fileContent.split('Message').filter(msg => msg.trim()).map(msg => 'Message' + msg);

        setMessageArray(messages); // Save all the messages
      } catch (error) {
        console.error("Error loading the file: ", error);
      }
    };

    fetchBeaconData();
  }, []);

  // Process a new message every 5 seconds
  useEffect(() => {
    if (messageArray.length > 0) {
      const interval = setInterval(() => {
        const currentMessage = messageArray[messageIndex];
        const parsedData = parseMessage(currentMessage);

        if (parsedData) {
          console.log(parsedData);
          setBeaconData(parsedData); // Update beacon data for the current message
        }

        // Move to the next message (loop back to the start if end is reached)
        setMessageIndex(prevIndex => (prevIndex + 1) % messageArray.length);
      }, 5000); // Read a new message every 5 seconds

      return () => clearInterval(interval); // Clean up the interval on unmount
    }
  }, [messageArray, messageIndex]);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      {/* Render the beacon model only for the current message */}
      {beaconData && <Model beaconData={beaconData} />}

      <OrbitControls />
      <Grids />
    </Canvas>
  );
};


export default App;
