
import React, { useMemo } from 'react';
import { Respondent, SurveyStatus } from '../types';

interface StatsProps {
  respondents: Respondent[];
}

const Stats: React.FC<StatsProps> = ({ respondents }) => {
  const stats = useMemo(() => {
    return respondents.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<SurveyStatus, number>);
  }, [respondents]);

  const total = respondents.length;
  const notStarted = stats[SurveyStatus.NotStarted] || 0;
  const inProgress = stats[SurveyStatus.InProgress] || 0;
  const completed = stats[SurveyStatus.Completed] || 0;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-cyan-400">Overall Progress</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-red-400">{SurveyStatus.NotStarted}</span>
          <span className="font-bold text-lg">{notStarted}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-yellow-400">{SurveyStatus.InProgress}</span>
          <span className="font-bold text-lg">{inProgress}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-green-400">{SurveyStatus.Completed}</span>
          <span className="font-bold text-lg">{completed}</span>
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-bold">Total Respondents</span>
          <span className="font-bold text-lg">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
