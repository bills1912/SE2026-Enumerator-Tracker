import React from 'react';
import { Enumerator, Respondent } from '../types';
import RespondentUploader from './RespondentUploader';
import EnumeratorList from './EnumeratorList';

interface ManagementViewProps {
  enumerators: Enumerator[];
  onUpload: (newRespondents: Omit<Respondent, 'id' | 'status'>[]) => void;
}

const ManagementView: React.FC<ManagementViewProps> = ({ enumerators, onUpload }) => {
  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Manajemen Tim & Responden</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                 <RespondentUploader enumerators={enumerators} onUpload={onUpload} />
            </div>
            <div className="lg:col-span-2">
                 <EnumeratorList enumerators={enumerators} />
            </div>
        </div>
    </div>
  );
};

export default ManagementView;
