export interface BeaconData{
    messageId: number;
    location: {latitude: number, longitude: number, altitude: number};
    rotation: {yaw: number, pitch: number, roll: number};
    acceleration: { yaw: number; pitch: number; roll: number};
    timestamp: Date;
}

export function parseMessage(message: string): BeaconData | null {
    try{
        const messageIdMatch = message.match(/Message\s*(\d+)/);
        const locationMatch = message.match(/L\|([\d\.-]+),([\d\.-]+),([\d\.-]+)/);
        const rotationMatch = message.match(/R\[([\d\.-]+),([\d\.-]+),([\d\.-]+)/);
        const accelerationMatch = message.match(/G\[([\d\.-]+),([\d\.-]+),([\d\.-]+)/);
        const timestampMatch = message.match(/RD\[(.*?)\]/);

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
    }
    catch(error){
        console.error('Error parsing message:', error);
        return null;
    }
}