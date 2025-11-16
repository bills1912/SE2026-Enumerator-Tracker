import React, { useMemo } from 'react';
import { Respondent, SurveyStatus } from '../types';
import { STATUS_COLORS } from '../constants';

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

  const chartData = [
    { label: SurveyStatus.NotStarted, value: notStarted, color: STATUS_COLORS[SurveyStatus.NotStarted] },
    { label: SurveyStatus.InProgress, value: inProgress, color: STATUS_COLORS[SurveyStatus.InProgress] },
    { label: SurveyStatus.Completed, value: completed, color: STATUS_COLORS[SurveyStatus.Completed] },
  ];

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard Statistik</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* FIX: Changed StatCard color to orange theme */}
            <StatCard title="Total Responden" value={total} colorClass="text-orange-500" total={total}/>
            <StatCard title={SurveyStatus.NotStarted} value={notStarted} colorClass="text-red-500" total={total}/>
            <StatCard title={SurveyStatus.InProgress} value={inProgress} colorClass="text-yellow-500" total={total}/>
            <StatCard title={SurveyStatus.Completed} value={completed} colorClass="text-green-500" total={total}/>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Rincian Progres Survei</h2>
            <div className="flex justify-around items-end h-64 space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {chartData.map(item => {
                    const percentage = total > 0 ? (item.value / total) * 100 : 0;
                    return (
                    <div key={item.label} className="flex flex-col items-center flex-1 h-full max-w-[100px]">
                        <div className="w-12 md:w-16 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex-grow w-full flex items-end relative overflow-hidden group">
                            <div 
                                className="w-full rounded-t-lg transition-all duration-500 ease-out" 
                                style={{ height: `${percentage}%`, backgroundColor: item.color }}
                            >
                                <div className="absolute top-0 left-0 w-full p-1 text-center font-bold text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.value} ({percentage.toFixed(0)}%)
                                </div>
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400 font-medium">{item.label}</p>
                    </div>
                    );
                })}
            </div>
      </div>
    </div>
  );
};

export default Stats;
