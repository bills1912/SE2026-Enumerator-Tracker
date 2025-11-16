import React, { useState, useCallback } from 'react';
import { Enumerator, Respondent } from '../types';
import { UploadIcon, DownloadIcon } from './Icons';

interface RespondentUploaderProps {
  enumerators: Enumerator[];
  onUpload: (newRespondents: Omit<Respondent, 'id' | 'status'>[]) => void;
}

const RespondentUploader: React.FC<RespondentUploaderProps> = ({ enumerators, onUpload }) => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const parseFile = (file: File) => {
    setIsParsing(true);
    setFeedback(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = (window as any).XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = (window as any).XLSX.utils.sheet_to_json(worksheet);

        const newRespondents: Omit<Respondent, 'id' | 'status'>[] = [];
        const errors: string[] = [];
        
        const header = Object.keys(json[0] || {});
        const requiredHeaders = ['Respondent Name', 'Latitude', 'Longitude', 'Enumerator Email'];
        if(!requiredHeaders.every(h => header.includes(h))){
            throw new Error('Invalid file format. Missing required headers: ' + requiredHeaders.join(', '));
        }

        json.forEach((row, index) => {
          const enumerator = enumerators.find(en => en.email.toLowerCase() === String(row['Enumerator Email']).toLowerCase());
          if (!enumerator) {
            errors.push(`Row ${index + 2}: Enumerator with email "${row['Enumerator Email']}" not found.`);
            return;
          }
          if (row['Latitude'] === undefined || row['Longitude'] === undefined || !row['Respondent Name']) {
            errors.push(`Row ${index + 2}: Missing required data (Name, Latitude, or Longitude).`);
            return;
          }
          
          newRespondents.push({
            name: String(row['Respondent Name']),
            location: [parseFloat(row['Latitude']), parseFloat(row['Longitude'])],
            enumeratorId: enumerator.id,
            provinsi: String(row['Provinsi'] || ''),
            kabupaten: String(row['Kabupaten'] || ''),
            kecamatan: String(row['Kecamatan'] || ''),
            desa: String(row['Desa'] || ''),
          });
        });

        if (errors.length > 0) {
          throw new Error(errors.join('\n'));
        }

        onUpload(newRespondents);
        setFeedback({ type: 'success', message: `Successfully added ${newRespondents.length} new respondents.` });
      } catch (error: any) {
        console.error("File parsing error:", error);
        setFeedback({ type: 'error', message: `Failed to parse file: ${error.message}` });
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => {
        setFeedback({type: 'error', message: 'Failed to read the file.'})
        setIsParsing(false);
    };
    reader.readAsBinaryString(file);
  };
  
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Respondent Name,Provinsi,Kabupaten,Kecamatan,Desa,Latitude,Longitude,Enumerator Email\n"
      + `"Example Respondent","12","22","050","002",34.07,-118.26,"${enumerators[0]?.email || 'enumerator@example.com'}"\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "respondent_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      {/* FIX: Changed heading color to orange theme */}
      <h3 className="text-xl font-semibold mb-4 text-orange-600 dark:text-orange-400">Manage Respondents</h3>
      <div className="space-y-4">
        <div>
          {/* FIX: Changed text color to orange theme */}
          <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md font-medium text-orange-600 dark:text-orange-400 p-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <UploadIcon className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2"/>
            <span>{isParsing ? 'Parsing...' : 'Upload a file'}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">XLSX or CSV</p>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx, .csv" disabled={isParsing}/>
          </label>
        </div>
        <button onClick={handleDownloadTemplate} className="w-full flex items-center justify-center space-x-2 bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            <DownloadIcon className="h-5 w-5"/>
            <span>Download Template</span>
        </button>
        {feedback && (
          <p className={`text-sm p-2 rounded ${feedback.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'}`} style={{whiteSpace: 'pre-wrap'}}>{feedback.message}</p>
        )}
      </div>
    </div>
  );
};

export default RespondentUploader;
