// src/App.tsx

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useState } from 'react';
import { Model } from './Beacon'; // Ensure you have Model in components
import { BeaconData, parseMessage } from './DataParsing'; // Import your parser
import { Grids } from './Grid'; // Ensure Grids is also moved to components

const App: React.FC = () => {
  const [beaconDataArray, setBeaconDataArray] = useState<BeaconData[]>([]);
   // Store only the current message
   const [currentIndex, setCurrentIndex] = useState(0);
  // Load the file content once
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
      }, 1000); // Update every 1 second (adjust as necessary)

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [beaconDataArray]);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      {/* Display the current message data */}
      {beaconDataArray.length > 0 && (
        <Model beaconData={beaconDataArray[currentIndex]} />
      )}

      <OrbitControls />
      <Grids />
    </Canvas>
  );
};

export default App;
