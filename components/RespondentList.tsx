
import React from 'react';
import { Respondent, SurveyStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { LatLngExpression } from 'leaflet';
import { getDistanceInMeters } from '../utils';

interface RespondentListProps {
  enumeratorId: string;
  respondents: Respondent[];
  updateRespondentStatus: (respondentId: string, status: SurveyStatus) => void;
  currentUserLocation: LatLngExpression | null;
}

const PROXIMITY_THRESHOLD_METERS = 50; // 50 meters

const RespondentList: React.FC<RespondentListProps> = ({ enumeratorId, respondents, updateRespondentStatus, currentUserLocation }) => {
  const myRespondents = respondents.filter(r => r.enumeratorId === enumeratorId);

  const renderStartSurveyButton = (respondent: Respondent) => {
    if (!currentUserLocation) {
        return (
            <button
                disabled
                className="w-full bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm opacity-50 cursor-not-allowed"
                title="Waiting for your location..."
            >
                Start Survey
            </button>
        );
    }
    
    const distance = getDistanceInMeters(currentUserLocation, respondent.location);
    const isWithinProximity = distance <= PROXIMITY_THRESHOLD_METERS;

    if (isWithinProximity) {
        return (
            <button
                onClick={() => updateRespondentStatus(respondent.id, SurveyStatus.InProgress)}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
            >
                Start Survey
            </button>
        );
    }

    return (
        <div className="w-full text-center">
             <button
                disabled
                className="w-full bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm opacity-50 cursor-not-allowed"
                title={`You must be within ${PROXIMITY_THRESHOLD_METERS}m of the respondent.`}
            >
                Start Survey
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                You are {distance.toFixed(0)}m away.
            </p>
        </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">My Respondents</h2>
      <ul className="space-y-3">
        {myRespondents.map(r => (
          <li key={r.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">{r.name}</h4>
              <span className={`text-xs font-bold px-2 py-1 rounded-full text-white`} style={{ backgroundColor: STATUS_COLORS[r.status] }}>
                {r.status}
              </span>
            </div>
            {r.status !== SurveyStatus.Completed && (
              <div className="flex space-x-2 mt-2">
                {r.status === SurveyStatus.NotStarted && renderStartSurveyButton(r)}
                {r.status === SurveyStatus.InProgress && (
                  <button
                    onClick={() => updateRespondentStatus(r.id, SurveyStatus.Completed)}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Complete Survey
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RespondentList;