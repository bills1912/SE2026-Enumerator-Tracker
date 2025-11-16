

import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression, Map, Marker } from 'leaflet';
import { User, Respondent, Enumerator, UserRole } from '../types';
import { STATUS_COLORS } from '../constants';
import { CrosshairsIcon } from './Icons';

interface MapProps {
  user: User;
  respondents: Respondent[];
  enumerators: Enumerator[];
  currentUserLocation: LatLngExpression | null;
}

// Custom SVG icon for enumerators
const enumeratorIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#06b6d4"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" /></svg>'),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

// Custom icon for the current user's location
const currentUserIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm1.5 6a.75.75 0 00-1.5 0v4.23l-2.22-2.22a.75.75 0 00-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 00-1.06-1.06L13.5 12.48V8.25z" clip-rule="evenodd" /></svg>'),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});


const MapComponent: React.FC<MapProps> = ({ user, respondents, enumerators, currentUserLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const isInitialPanDone = useRef(false);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = L.map(mapContainer.current).setView([34.0522, -118.2437], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
      
      // Initial theme check for map
      if(document.documentElement.classList.contains('dark')) {
        mapContainer.current.classList.add('dark');
      }
    }
  }, []);
  
  const createCircleMarker = (color: string): L.DivIcon => {
      return L.divIcon({
          html: `<span style="background-color: ${color}; width: 1rem; height: 1rem; border-radius: 50%; display: block; border: 2px solid white;"></span>`,
          className: 'bg-transparent',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
      });
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
    // Update respondent markers
    respondents.forEach(r => {
        const color = STATUS_COLORS[r.status];
        const icon = createCircleMarker(color);
        let marker: L.Marker;

        if (markersRef.current[r.id]) {
            marker = markersRef.current[r.id];
            marker.setLatLng(r.location).setIcon(icon);
        } else {
            marker = L.marker(r.location, { icon }).addTo(map);
            markersRef.current[r.id] = marker;
        }

        const popupContent = `<b>${r.name}</b><br/>Status: ${r.status}`;
        marker.bindPopup(popupContent);
    });
    
    // Update enumerator markers if supervisor
    if (user.role === UserRole.Supervisor) {
        enumerators.forEach(e => {
            if (e.location) {
                if (markersRef.current[e.id]) {
                    markersRef.current[e.id].setLatLng(e.location);
                } else {
                    const marker = L.marker(e.location, { icon: enumeratorIcon }).addTo(map);
                    marker.bindPopup(`<b>${e.name}</b><br/>${e.isMoving ? 'In Transit' : 'On-Site'}`);
                    markersRef.current[e.id] = marker;
                }
            }
        });
    }

    // Update current user location marker
    if (currentUserLocation) {
        const userId = `user-${user.id}`;
        if (markersRef.current[userId]) {
            markersRef.current[userId].setLatLng(currentUserLocation);
        } else {
            const marker = L.marker(currentUserLocation, { icon: currentUserIcon, zIndexOffset: 1000 }).addTo(map);
            marker.bindPopup("<b>Your Location</b>");
            markersRef.current[userId] = marker;
        }
        // Only pan on the initial location fix
        if (!isInitialPanDone.current) {
            map.setView(currentUserLocation, 16);
            isInitialPanDone.current = true;
        }
    }

  }, [respondents, enumerators, currentUserLocation, user.id, user.role]);
  
  // Add class to map container when theme changes
  useEffect(() => {
    if (mapContainer.current) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = (mutation.target as HTMLElement).classList.contains('dark');
                     if(mapContainer.current) {
                        mapContainer.current.classList.toggle('dark', isDark);
                     }
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }
  }, []);

  const handleRecenter = () => {
    if (mapRef.current && currentUserLocation) {
      mapRef.current.setView(currentUserLocation, 16);
    }
  };

  return (
    <div className="h-full w-full relative">
        <div ref={mapContainer} className="h-full w-full leaflet-container" />
        {user.role === UserRole.Enumerator && currentUserLocation && (
            <button
            onClick={handleRecenter}
            className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Recenter map on your location"
            title="Recenter map"
            >
            <CrosshairsIcon className="h-5 w-5" />
            </button>
        )}
    </div>
  );
};

export default MapComponent;
