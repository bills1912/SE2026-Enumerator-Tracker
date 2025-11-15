
import React from 'react';
import { User, Respondent, Enumerator, SurveyStatus, UserRole } from '../types';
import Stats from './Stats';
import RespondentList from './RespondentList';
import RespondentUploader from './RespondentUploader';
import { UserIcon } from './Icons';

interface SidebarProps {
  user: User;
  respondents: Respondent[];
  enumerators: Enumerator[];
  updateRespondentStatus: (respondentId: string, status: SurveyStatus) => void;
  onAddRespondents: (newRespondents: Omit<Respondent, 'id' | 'status'>[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, respondents, enumerators, updateRespondentStatus, onAddRespondents }) => {
    const isSupervisor = user.role === UserRole.Supervisor;

  return (
    <aside className="w-96 bg-gray-900 flex flex-col p-4 shadow-lg overflow-y-auto space-y-6">
        {isSupervisor && (
            <>
                <div>
                    <h2 className="text-2xl font-bold text-cyan-400 mb-4">Dashboard</h2>
                    <Stats respondents={respondents} />
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-400">Enumerators</h3>
                    <ul className="space-y-3">
                        {enumerators.map(e => (
                            <li key={e.id} className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <UserIcon className="h-6 w-6 text-gray-400" />
                                    <span>{e.name}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${e.isMoving ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                    {e.isMoving ? 'In Transit' : 'On-Site'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <RespondentUploader enumerators={enumerators} onUpload={onAddRespondents} />
            </>
        )}

        {!isSupervisor && (
            <RespondentList
                enumeratorId={user.id}
                respondents={respondents}
                updateRespondentStatus={updateRespondentStatus}
            />
        )}
    </aside>
  );
};

export default Sidebar;