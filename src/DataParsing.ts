export interface BeaconData{
    messageId: number;
    location: {latitude: number, longitude: number, altitude: number};
    rotation: {yaw: number, pitch: number, poll: number};
    acceleration: { yaw: number; pitch: number; roll: number};
    timestamp: Date;
}

