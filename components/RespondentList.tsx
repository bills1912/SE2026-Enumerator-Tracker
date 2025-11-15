
import React from 'react';
import { Respondent, SurveyStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface RespondentListProps {
  enumeratorId: string;
  respondents: Respondent[];
  updateRespondentStatus: (respondentId: string, status: SurveyStatus) => void;
}

const RespondentList: React.FC<RespondentListProps> = ({ enumeratorId, respondents, updateRespondentStatus }) => {
  const myRespondents = respondents.filter(r => r.enumeratorId === enumeratorId);

  return (
    <div>
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">My Respondents</h2>
      <ul className="space-y-3">
        {myRespondents.map(r => (
          <li key={r.id} className="bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">{r.name}</h4>
              <span className={`text-xs font-bold px-2 py-1 rounded-full`} style={{ backgroundColor: STATUS_COLORS[r.status] }}>
                {r.status}
              </span>
            </div>
            {r.status !== SurveyStatus.Completed && (
              <div className="flex space-x-2 mt-2">
                {r.status === SurveyStatus.NotStarted && (
                  <button
                    onClick={() => updateRespondentStatus(r.id, SurveyStatus.InProgress)}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Start Survey
                  </button>
                )}
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
