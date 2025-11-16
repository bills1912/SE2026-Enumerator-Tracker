import { LatLngExpression } from 'leaflet';

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param point1 - The first point [lat, lng].
 * @param point2 - The second point [lat, lng].
 * @returns The distance in meters.
 */
export function getDistanceInMeters(point1: LatLngExpression, point2: LatLngExpression): number {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371e3; // Earth's radius in meters
  const lat1 = (point1 as number[])[0];
  const lon1 = (point1 as number[])[1];
  const lat2 = (point2 as number[])[0];
  const lon2 = (point2 as number[])[1];

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
