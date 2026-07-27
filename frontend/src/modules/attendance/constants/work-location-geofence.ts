import type { GeoPoint } from "../types/attendance.types";

export interface WorkLocationGeofence {
  id: number;
  name: string;
  location: GeoPoint;
  radiusMeters: number; // in meters
}

export const WORK_LOCATION_GEOFENCES: WorkLocationGeofence[] = [
  {
    id: 1,
    name: "Head Office",
    location: {
      lat: 22.3072,
      lng: 73.1812,
    },
    radiusMeters: 100,
  },
];
