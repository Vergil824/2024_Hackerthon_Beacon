import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main App component
import './styles.css'; // Import your CSS for styling
import { useGLTF } from '@react-three/drei';

// Preload the GLTF model for the beacon
useGLTF.preload('/beacon_model.gltf');

// Get the root element from the HTML
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the App component inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);