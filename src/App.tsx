// src/App.tsx

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useState } from 'react';
import { Model } from './Beacon'; // Ensure you have Model in components
import { BeaconData, parseMessage } from './DataParsing'; // Import your parser
import { Grids } from './Grid'; // Ensure Grids is also moved to components

const App = () => {
  const [beaconDataArray, setBeaconDataArray] = useState<BeaconData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMessages = async() => {
      try {
        const response = await fetch("/updated_beacon_output.txt");
        const text = await response.text();

        const rawMessages = text.split("Message ").slice(1).map(msg => "Message " + msg.trim());

        console.log(rawMessages);
        
        const parsedMessages = rawMessages
          .map(message => parseMessage(message))
          .filter((data): data is BeaconData => data !== null);

        console.log("Parsed messages: ", parsedMessages);
        setBeaconDataArray(parsedMessages);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };
    // const message = 'Message 23435L[0.000,0.000,5.0]R[600.953583,-11.33508,6.500096]A[-0.264000,-0.042000,0.959000]G[-10.465000,-83.466003,15.338000]RD[0000-01-01T00:53:38]';
    // const parsedData = parseMessage(message);
  
    // if (parsedData) {
    //   console.log('Parsed beacon data:', parsedData);
    //   setBeaconData(parsedData);
    // }
    fetchMessages();
  }, []);

  // Update the current index to iterate through the messages
  useEffect(() => {
    if (beaconDataArray.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % beaconDataArray.length); // Loop through messages
      }, 50); // Update every 1 second (adjust as necessary)

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
