import { WORK_LOCATION_GEOFENCES } from "../constants/work-location-geofence";
import type { GeoPoint } from "../types/attendance.types";

const EARTH_RADIUS = 6371000; // metres

const toRadians = (degree: number) => degree * (Math.PI / 180);

/**
 * Returns the distance between two coordinates in metres.
 * Uses the Haversine Formula.
 */
export const calculateDistance = (
  pointA: GeoPoint,
  pointB: GeoPoint
): number => {
  const latDiff = toRadians(pointB.lat - pointA.lat);
  const lngDiff = toRadians(pointB.lng - pointA.lng);

  const lat1 = toRadians(pointA.lat);
  const lat2 = toRadians(pointB.lat);

  const haversine =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(lngDiff / 2) *
      Math.sin(lngDiff / 2);

  const centralAngle =
    2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return EARTH_RADIUS * centralAngle;
};

/**
 * Returns true if the employee is inside the office radius.
 */
export const isWithinGeofence = (
  employeeLocation: GeoPoint,
  officeLocation: GeoPoint,
  radius: number
) => {
  return (
    calculateDistance(employeeLocation, officeLocation) <= radius
  );
};

/**
 * Returns the first matching office if employee is inside
 * its allowed radius.
 */
export const findMatchingWorkLocation = (
  employeeLocation: GeoPoint
) => {
  return WORK_LOCATION_GEOFENCES.find((office) =>
    isWithinGeofence(
      employeeLocation,
      office.location,
      office.radiusMeters
    )
  );
};