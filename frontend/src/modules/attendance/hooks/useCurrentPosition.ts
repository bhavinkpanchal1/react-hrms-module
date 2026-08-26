import { useCallback, useEffect, useState } from "react";
import type { GeoPoint } from "../types/attendance.types";

export const useCurrentPosition = () => {
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const getCurrentLocation = useCallback(() => {
    //Check if Browser supports
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({
          lat: coords.latitude,
          lng: coords.longitude,
        });

        setLoading(false);
      },
      (err) => {
        setLoading(false);

        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied.");
            break;

          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable.");
            break;

          case err.TIMEOUT:
            setError("Location request timed out.");
            break;

          default:
            setError("Unable to retrieve current location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  useEffect(() => {
    const requestId = window.setTimeout(getCurrentLocation, 0);
    return () => window.clearTimeout(requestId);
  }, [getCurrentLocation]);

  return{
    position,
    loading,
    error,
    refreshLocation: getCurrentLocation,
  }
};
