
import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression, Map, Marker } from 'leaflet';
import { User, Respondent, Enumerator, UserRole, SurveyStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { CrosshairsIcon, LocationMarkerIcon } from './Icons';

interface MapProps {
  user: User;
  respondents: Respondent[];
  enumerators: Enumerator[];
  currentUserLocation: LatLngExpression | null;
}

// Custom SVG icon for enumerators
const enumeratorIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E18939"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></svg>'),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: 'data:image/svg+xml;base64,' + btoa('<svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="40" ry="20" fill="black" fill-opacity="0.2" /></svg>'),
    shadowSize: [32, 32],
    shadowAnchor: [16, 32],
});

// Custom icon for the current user's location using DivIcon for CSS animation
const currentUserIcon = new L.DivIcon({
    html: `<div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>`,
    className: 'pulse-marker', // This class will trigger the CSS animation
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

const MapLegend = () => (
    <div className="leaflet-bottom leaflet-left">
        <div className="leaflet-control leaflet-bar bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-48">
            <h4 className="font-bold mb-2 text-sm text-gray-800 dark:text-gray-100">Legenda</h4>
            <ul className="space-y-1 text-xs">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                    <li key={status} className="flex items-center">
                        <span style={{ backgroundColor: color }} className="w-3 h-3 rounded-full mr-2 border border-white/50"></span>
                        <span className="text-gray-700 dark:text-gray-300">{(status as SurveyStatus).replace('Surveyed', '')}</span>
                    </li>
                ))}
                {/* Separator */}
                <li className="pt-1 mt-1 border-t border-gray-200 dark:border-gray-600"></li>
                <li className="flex items-center">
                    <img src={enumeratorIcon.options.iconUrl} alt="Enumerator Icon" className="w-4 h-4 mr-1.5"/>
                    <span className="text-gray-700 dark:text-gray-300">Enumerator</span>
                </li>
            </ul>
        </div>
    </div>
);


const MapComponent: React.FC<MapProps> = ({ user, respondents, enumerators, currentUserLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const isInitialPanDone = useRef(false);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = L.map(mapContainer.current, { zoomControl: false }).setView([34.0522, -118.2437], 12);
      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
      
      if(document.documentElement.classList.contains('dark')) {
        mapContainer.current.classList.add('dark');
      }
    }
  }, []);
  
  const createCircleMarker = (color: string): L.DivIcon => {
      return L.divIcon({
          html: `<span style="background-color: ${color};" class="w-4 h-4 rounded-full block border-2 border-white shadow-md"></span>`,
          className: 'bg-transparent',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
      });
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
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
    
    if (user.role === UserRole.Supervisor) {
        enumerators.forEach(e => {
            if (e.location) {
                const assignedRespondents = respondents.filter(r => r.enumeratorId === e.id);
                const respondentListHtml = assignedRespondents.length > 0 
                    ? `<ul style="list-style: disc; padding-left: 20px; margin: 0;">` + assignedRespondents.map(r => 
                        `<li>${r.name} - <strong style="color: ${STATUS_COLORS[r.status]}">${r.status}</strong></li>`
                      ).join('') + `</ul>`
                    : '<p style="margin: 0;">Tidak ada responden.</p>';
                const popupContent = `
                    <div style="max-height: 150px; overflow-y: auto; font-family: Inter, sans-serif; font-size: 13px;">
                        <h4 style="font-weight: bold; margin: 0 0 4px 0; font-size: 14px;">${e.name}</h4>
                        <p style="margin: 0 0 8px 0;">Status: <strong>${e.isMoving ? 'Dalam Perjalanan' : 'Di Lokasi'}</strong></p>
                        <hr style="margin: 4px 0; border: 0; border-top: 1px solid #ccc;">
                        <h5 style="font-weight: bold; margin: 8px 0 4px 0;">Tugas Responden:</h5>
                        ${respondentListHtml}
                    </div>
                `;
                
                let marker: L.Marker;
                if (markersRef.current[e.id]) {
                    marker = markersRef.current[e.id];
                    marker.setLatLng(e.location);
                } else {
                    marker = L.marker(e.location, { icon: enumeratorIcon }).addTo(map);
                    markersRef.current[e.id] = marker;
                }
                marker.bindPopup(popupContent);
            }
        });
    }

    if (currentUserLocation) {
        const userId = `user-${user.id}`;
        if (markersRef.current[userId]) {
            markersRef.current[userId].setLatLng(currentUserLocation);
        } else {
            const marker = L.marker(currentUserLocation, { icon: currentUserIcon, zIndexOffset: 1000 }).addTo(map);
            marker.bindPopup("<b>Lokasi Anda</b>");
            markersRef.current[userId] = marker;
        }
        if (!isInitialPanDone.current) {
            map.setView(currentUserLocation, 16);
            isInitialPanDone.current = true;
        }
    }

  }, [respondents, enumerators, currentUserLocation, user.id, user.role]);
  
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
    <div className="h-full w-full relative rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
        <div ref={mapContainer} className="h-full w-full leaflet-container" />
        <MapLegend />
        {user.role === UserRole.Enumerator && currentUserLocation && (
            <button
            onClick={handleRecenter}
            className="absolute top-4 right-12 z-[1000] bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg p-2.5 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Recenter map on your location"
            title="Pusatkan peta"
            >
            <CrosshairsIcon className="h-5 w-5" />
            </button>
        )}
    </div>
  );
};

export default MapComponent;