
import React, { useMemo } from 'react';
import { Respondent, SurveyStatus } from '../types';

interface StatsProps {
  respondents: Respondent[];
}

const StatCard: React.FC<{ title: string; value: number; colorClass: string, total: number }> = ({ title, value, colorClass, total }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
                </div>
                 <div className={`p-2 rounded-md ${colorClass} bg-opacity-10 text-opacity-100`}>
                    <span className={`text-lg font-bold ${colorClass}`}>{percentage.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    );
};

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
    <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard Statistik</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Responden" value={total} colorClass="text-blue-500" total={total}/>
            <StatCard title={SurveyStatus.NotStarted} value={notStarted} colorClass="text-red-500" total={total}/>
            <StatCard title={SurveyStatus.InProgress} value={inProgress} colorClass="text-yellow-500" total={total}/>
            <StatCard title={SurveyStatus.Completed} value={completed} colorClass="text-green-500" total={total}/>
        </div>
    </div>
  );
};

export default Stats;