// src/App.tsx

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from './Beacon'; // Ensure you have Model in components
import { Grids } from './Grid'; // Ensure Grids is also moved to components
import { parseMessage, BeaconData } from './DataParsing'; // Import your parser

const App = () => {
  const [beaconData, setBeaconData] = useState<BeaconData | null>(null);

  useEffect(() => {
    const message = 'Message 23435L[0.000,0.000,600.0]R[314.953583,-11.33508,6.500096]A[-0.264000,-0.042000,0.959000]G[-10.465000,-83.466003,15.338000]RD[0000-01-01T00:53:38]';
    const parsedData = parseMessage(message);

    if (parsedData) {
      setBeaconData(parsedData);
    }
  }, []);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      {/* Pass parsed beacon data to Model */}
      {beaconData && <Model beaconData={beaconData} />}

      <OrbitControls />
      <Grids />
    </Canvas>
  );
};

export default App;
