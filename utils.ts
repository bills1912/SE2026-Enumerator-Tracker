
import { LatLngExpression } from 'leaflet';

/**
 * Normalizes a Leaflet LatLngExpression into a tuple of numbers.
 * @param location - The location to normalize.
 * @returns A tuple [latitude, longitude] or null if invalid.
 */
export function normalizeLatLng(location: LatLngExpression): [number, number] | null {
  if (!location) return null;

  if (Array.isArray(location) && location.length === 2 && typeof location[0] === 'number' && typeof location[1] === 'number') {
    return location as [number, number];
  }

  if (typeof location === 'object' && 'lat' in location && 'lng' in location) {
    const loc = location as { lat: unknown, lng: unknown };
    if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
        return [loc.lat, loc.lng];
    }
  }

  return null;
}


/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param point1 - The first point [lat, lng].
 * @param point2 - The second point [lat, lng].
 * @returns The distance in meters.
 */
export function getDistanceInMeters(point1: LatLngExpression, point2: LatLngExpression): number {
  const normPoint1 = normalizeLatLng(point1);
  const normPoint2 = normalizeLatLng(point2);

  if (!normPoint1 || !normPoint2) {
    return Infinity;
  }
  
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371e3; // Earth's radius in meters
  const lat1 = normPoint1[0];
  const lon1 = normPoint1[1];
  const lat2 = normPoint2[0];
  const lon2 = normPoint2[1];

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Formats a date into a relative time string (e.g., "5 minutes ago").
 * @param date - The date to format.
 * @returns A string representing the relative time.
 */
export function formatTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
  
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
  
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
  
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
  
    return "just now";
}