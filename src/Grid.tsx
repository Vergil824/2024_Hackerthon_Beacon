import React from 'react';

export const Grids = () => {
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