
import { useState, useEffect } from 'react';
import { LatLngExpression } from 'leaflet';

interface GeolocationState {
  position: LatLngExpression | null;
  error: string | null;
}

const useGeolocation = (options?: PositionOptions): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
  });

  useEffect(() => {
    let watchId: number;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setState({
            position: [position.coords.latitude, position.coords.longitude],
            error: null,
          });
        },
        (error) => {
          setState((prevState) => ({ ...prevState, error: error.message }));
        },
        options
      );
    } else {
      setState((prevState) => ({ ...prevState, error: 'Geolocation is not supported by this browser.' }));
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [options]);

  return state;
};

export default useGeolocation;