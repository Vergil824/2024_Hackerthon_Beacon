export interface BeaconData {
    messageId: number;
    location: {latitude: number, longitude: number, altitude: number};
    rotation: {yaw: number, pitch: number, roll: number};
    acceleration: { yaw: number; pitch: number; roll: number};
    timestamp: Date;
}

export function parseMessage(message: string): BeaconData | null {
  try {
    // Match the Message ID (e.g., "Message 23435")
    const messageIdMatch = message.match(/Message\s*(\d+)/);
    
    // Match the Location (L field with latitude, longitude, altitude)
    const locationMatch = message.match(/L\[(.*?),(.*?),(.*?)\]/);
    
    // Match the Rotation (R field with yaw, pitch, roll)
    const rotationMatch = message.match(/R\[(.*?),(.*?),(.*?)\]/);
    
    // Match the Acceleration (A field with yaw, pitch, roll)
    const accelerationMatch = message.match(/A\[(.*?),(.*?),(.*?)\]/);
    
    // Match the Gyroscopic Acceleration (G field)
    const gyroscopicMatch = message.match(/G\[(.*?),(.*?),(.*?)\]/);
    
    // Match the Timestamp (RD field with datetime)
    const timestampMatch = message.match(/RD\[(.*?)\]/);

    // Ensure all matches are successful
    if (messageIdMatch && locationMatch && rotationMatch && accelerationMatch && timestampMatch) {
      return {
        messageId: parseInt(messageIdMatch[1]),
        location: {
          latitude: parseFloat(locationMatch[1]),
          longitude: parseFloat(locationMatch[2]),
          altitude: parseFloat(locationMatch[3]),
        },
        rotation: {
          yaw: parseFloat(rotationMatch[1]),
          pitch: parseFloat(rotationMatch[2]),
          roll: parseFloat(rotationMatch[3]),
        },
        acceleration: {
          yaw: parseFloat(accelerationMatch[1]),
          pitch: parseFloat(accelerationMatch[2]),
          roll: parseFloat(accelerationMatch[3]),
        },
        timestamp: new Date(timestampMatch[1]), // Convert timestamp to Date object
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing message:', error);
    return null;
  }
}