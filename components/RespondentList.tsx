

import React, { useState } from 'react';
import { Respondent, SurveyStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { LatLngExpression } from 'leaflet';
import { getDistanceInMeters } from '../utils';
import { ClipboardIcon } from './Icons';

interface RespondentListProps {
  enumeratorId: string;
  respondents: Respondent[];
  updateRespondentStatus: (respondentId: string, status: SurveyStatus) => void;
  currentUserLocation: LatLngExpression | null;
}

const PROXIMITY_THRESHOLD_METERS = 50; // 50 meters

const RespondentList: React.FC<RespondentListProps> = ({ enumeratorId, respondents, updateRespondentStatus, currentUserLocation }) => {
  const myRespondents = respondents.filter(r => r.enumeratorId === enumeratorId);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (respondent: Respondent) => {
    const location = Array.isArray(respondent.location) 
        ? `${(respondent.location[0] as number).toFixed(6)}, ${(respondent.location[1] as number).toFixed(6)}` 
        : String(respondent.location);
    const textToCopy = `Nama: ${respondent.name}\nLokasi: ${location}\nStatus: ${respondent.status}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedId(respondent.id);
        setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
        console.error('Gagal menyalin detail: ', err);
    });
  };

  const renderStartSurveyButton = (respondent: Respondent) => {
    if (!currentUserLocation) {
        return (
            <button
                disabled
                className="flex-1 bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm opacity-50 cursor-not-allowed"
                title="Menunggu lokasi Anda..."
            >
                Mulai Survei
            </button>
        );
    }
    
    const distance = getDistanceInMeters(currentUserLocation, respondent.location);
    const isWithinProximity = distance <= PROXIMITY_THRESHOLD_METERS;

    if (isWithinProximity) {
        return (
            <button
                onClick={() => updateRespondentStatus(respondent.id, SurveyStatus.InProgress)}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
            >
                Mulai Survei
            </button>
        );
    }

    return (
        <div className="flex-1 text-center">
             <button
                disabled
                className="w-full bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm opacity-50 cursor-not-allowed"
                title={`Anda harus berada dalam jarak ${PROXIMITY_THRESHOLD_METERS}m dari responden.`}
            >
                Mulai Survei
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Anda berjarak {distance.toFixed(0)}m.
            </p>
        </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">Responden Saya</h2>
      <ul className="space-y-3">
        {myRespondents.map(r => (
          <li key={r.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">{r.name}</h4>
              <span className={`text-xs font-bold px-2 py-1 rounded-full text-white`} style={{ backgroundColor: STATUS_COLORS[r.status] }}>
                {r.status}
              </span>
            </div>
            <div className="flex items-stretch space-x-2 mt-2">
              {r.status === SurveyStatus.NotStarted && renderStartSurveyButton(r)}
              {r.status === SurveyStatus.InProgress && (
                <button
                  onClick={() => updateRespondentStatus(r.id, SurveyStatus.Completed)}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                >
                  Selesaikan Survei
                </button>
              )}
              <button
                onClick={() => handleCopy(r)}
                className="flex-1 bg-gray-500 hover:bg-gray-400 text-white font-bold py-1 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                title="Salin Detail Responden"
              >
                {copiedId === r.id ? (
                  <span>Tersalin!</span>
                ) : (
                  <>
                    <ClipboardIcon className="h-4 w-4" />
                    <span>Salin Detail</span>
                  </>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RespondentList;