
import React, { useMemo } from 'react';
import { Respondent, SurveyStatus, User, UserRole } from '../types';
import { STATUS_COLORS, PROJECT_DUE_DATE } from '../constants';
import { CheckCircleIcon, RefreshIcon, XCircleIcon, UsersIcon, CalendarIcon } from './Icons';

interface StatsProps {
  user: User;
  respondents: Respondent[];
}

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    colorClass: string;
    bgColorClass: string;
    icon: React.FC<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, colorClass, bgColorClass, icon: Icon }) => {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                </div>
                <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${bgColorClass}`}>
                   <Icon className={`w-7 h-7 ${colorClass}`} />
                </div>
            </div>
            <p className={`text-sm font-medium mt-auto pt-2 ${colorClass}`}>{description}</p>
        </div>
    );
};


const Stats: React.FC<StatsProps> = ({ user, respondents }) => {
  // RBAC Guard: Only supervisors can see this component
  if (user.role !== UserRole.Supervisor) {
    return null;
  }
    
  const stats = useMemo(() => {
    const statusCounts = respondents.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<SurveyStatus, number>);
    return statusCounts;
  }, [respondents]);

  const deadlineInfo = useMemo(() => {
    const now = new Date();
    const deadline = PROJECT_DUE_DATE;
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
        return {
            value: `${diffDays}`,
            description: `Hari Tersisa`,
            color: 'text-green-500',
            bgColor: 'bg-green-100 dark:bg-green-900/30'
        };
    } else if (diffDays === 0) {
        return {
            value: 'Hari Ini',
            description: 'Batas Waktu Proyek',
            color: 'text-orange-500',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30'
        };
    } else {
        return {
            value: `${Math.abs(diffDays)}`,
            description: `Hari Terlambat`,
            color: 'text-red-500',
            bgColor: 'bg-red-100 dark:bg-red-900/30'
        };
    }
}, []);


  const total = respondents.length;
  const notStarted = stats[SurveyStatus.NotStarted] || 0;
  const inProgress = stats[SurveyStatus.InProgress] || 0;
  const completed = stats[SurveyStatus.Completed] || 0;
  
  const getPercentage = (value: number) => total > 0 ? ((value / total) * 100).toFixed(0) + '%' : '0%';

  const chartData = [
    { label: SurveyStatus.Completed, value: completed, color: STATUS_COLORS[SurveyStatus.Completed], icon: CheckCircleIcon },
    { label: SurveyStatus.InProgress, value: inProgress, color: STATUS_COLORS[SurveyStatus.InProgress], icon: RefreshIcon },
    { label: SurveyStatus.NotStarted, value: notStarted, color: STATUS_COLORS[SurveyStatus.NotStarted], icon: XCircleIcon },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard Statistik</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Responden" value={total} description="Seluruh target responden" colorClass="text-orange-500" bgColorClass="bg-orange-100 dark:bg-orange-900/30" icon={UsersIcon} />
            <StatCard title="Batas Waktu Proyek" value={deadlineInfo.value} description={deadlineInfo.description} colorClass={deadlineInfo.color} bgColorClass={deadlineInfo.bgColor} icon={CalendarIcon} />
            <StatCard title={SurveyStatus.InProgress} value={inProgress} description={`${getPercentage(inProgress)} Dalam Proses`} colorClass="text-yellow-500" bgColorClass="bg-yellow-100 dark:bg-yellow-900/30" icon={RefreshIcon} />
            <StatCard title={SurveyStatus.Completed} value={completed} description={`${getPercentage(completed)} Selesai`} colorClass="text-green-500" bgColorClass="bg-green-100 dark:bg-green-900/30" icon={CheckCircleIcon} />
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Rincian Progres Survei</h2>
            <div className="flex justify-around items-end h-72 space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {chartData.map(item => {
                    const percentage = total > 0 ? (item.value / total) * 100 : 0;
                    return (
                    <div key={item.label} className="flex flex-col items-center flex-1 h-full max-w-[120px] group">
                        <div className="w-full text-center mb-2">
                           <p className="font-bold text-xl text-gray-800 dark:text-gray-100">{item.value}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{getPercentage(item.value)}</p>
                        </div>
                        <div className="w-12 md:w-16 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex-grow w-full flex items-end relative overflow-hidden">
                            <div 
                                className="w-full rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-90" 
                                style={{ height: `${percentage}%`, backgroundColor: item.color }}
                            >
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