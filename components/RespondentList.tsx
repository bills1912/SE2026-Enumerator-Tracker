

import React, { useState, useMemo } from 'react';
import { Respondent, SurveyStatus, User, UserRole } from '../types';
import { STATUS_COLORS, PROJECT_DUE_DATE } from '../constants';
import { LatLngExpression } from 'leaflet';
import { getDistanceInMeters, normalizeLatLng } from '../utils';
import { ClipboardIcon, RouteIcon, XCircleIcon, RefreshIcon, CheckCircleIcon, ShieldCheckIcon, CalendarIcon, ExclamationTriangleIcon, LocationMarkerIcon } from './Icons';

interface RespondentListProps {
  user: User;
  respondents: Respondent[];
  updateRespondentStatus: (respondentId: string, status: SurveyStatus) => void;
  currentUserLocation: LatLngExpression | null;
}

const PROXIMITY_THRESHOLD_METERS = 50; // 50 meters

const statusOptions: { value: SurveyStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: SurveyStatus.NotStarted, label: 'Belum' },
    { value: SurveyStatus.InProgress, label: 'Proses' },
    { value: SurveyStatus.Completed, label: 'Selesai' },
    { value: SurveyStatus.Reviewed, label: 'Direview' },
];

const statusIcons: Record<SurveyStatus, React.FC<{className?: string}>> = {
    [SurveyStatus.NotStarted]: XCircleIcon,
    [SurveyStatus.InProgress]: RefreshIcon,
    [SurveyStatus.Completed]: CheckCircleIcon,
    [SurveyStatus.Reviewed]: ShieldCheckIcon,
}

const RespondentList: React.FC<RespondentListProps> = ({ user, respondents, updateRespondentStatus, currentUserLocation }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SurveyStatus | 'all'>('all');
  const [proximityFilter, setProximityFilter] = useState<boolean>(false);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [selectedRespondentIds, setSelectedRespondentIds] = useState<Set<string>>(new Set());
  
  const myRespondents = useMemo(() => {
    if (user.role === UserRole.Supervisor) {
      return respondents;
    }
    return respondents.filter(r => r.enumeratorId === user.id);
  }, [respondents, user]);

  const filteredRespondents = useMemo(() => {
    return myRespondents
      .filter(r => r.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(r => statusFilter === 'all' || r.status === statusFilter)
      .filter(r => {
        if (!proximityFilter || !currentUserLocation) return true;
        const distance = getDistanceInMeters(currentUserLocation, r.location);
        return distance <= PROXIMITY_THRESHOLD_METERS;
      });
  }, [myRespondents, statusFilter, proximityFilter, currentUserLocation, nameFilter]);
  
  const canReviewAnySelected = useMemo(() => {
    if (selectedRespondentIds.size === 0) return false;
    for (const id of selectedRespondentIds) {
        const respondent = respondents.find(r => r.id === id);
        if (respondent && respondent.status === SurveyStatus.Completed) {
            return true;
        }
    }
    return false;
  }, [selectedRespondentIds, respondents]);

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

  const handleSelectRespondent = (respondentId: string) => {
    setSelectedRespondentIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(respondentId)) {
            newSet.delete(respondentId);
        } else {
            newSet.add(respondentId);
        }
        return newSet;
    });
  };

  const handleSelectAll = () => {
      if (selectedRespondentIds.size === filteredRespondents.length) {
          setSelectedRespondentIds(new Set());
      } else {
          const allFilteredIds = filteredRespondents.map(r => r.id);
          setSelectedRespondentIds(new Set(allFilteredIds));
      }
  };

  const handleBulkReview = () => {
    selectedRespondentIds.forEach(id => {
        const respondent = respondents.find(r => r.id === id);
        if (respondent && respondent.status === SurveyStatus.Completed) {
            updateRespondentStatus(id, SurveyStatus.Reviewed);
        }
    });
    setSelectedRespondentIds(new Set());
  };

  const createClickHandler = (handler: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    handler();
  };

  const handleCopy = (respondent: Respondent) => {
    const normLocation = normalizeLatLng(respondent.location);
    const locationString = normLocation ? `${normLocation[0].toFixed(6)}, ${normLocation[1].toFixed(6)}` : 'N/A';
    const textToCopy = `Nama: ${respondent.name}\nLokasi: ${locationString}\nStatus: ${respondent.status}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedId(respondent.id);
        setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => console.error('Gagal menyalin detail: ', err));
  };

  const handleShowRoute = (respondent: Respondent) => {
    if (!currentUserLocation) {
      alert('Lokasi Anda saat ini tidak tersedia untuk menampilkan rute.');
      return;
    }

    const origin = normalizeLatLng(currentUserLocation);
    const destination = normalizeLatLng(respondent.location);

    if (origin && destination) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin[0]},${origin[1]}&destination=${destination[0]},${destination[1]}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('Could not open route. Invalid location format for origin or destination.', { origin: currentUserLocation, destination: respondent.location });
      alert('Gagal menampilkan rute: format lokasi tidak valid.');
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setProximityFilter(false);
    setNameFilter('');
    setSelectedRespondentIds(new Set());
  };

  const isFilterActive = statusFilter !== 'all' || proximityFilter || nameFilter !== '';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
        {user.role === UserRole.Supervisor ? 'Semua Responden' : 'Responden Saya'}
      </h2>
      
      {user.role === UserRole.Enumerator && (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg mb-4 flex items-center justify-between">
            <div className="flex items-start">
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-4 ${deadlineInfo.bgColor}`}>
                   <CalendarIcon className={`w-6 h-6 ${deadlineInfo.color}`} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Batas Waktu Proyek</p>
                    <p className={`text-lg font-bold ${deadlineInfo.color}`}>{deadlineInfo.description}</p>
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{deadlineInfo.value}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-4 border border-gray-200 dark:border-gray-700 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-grow">
              <input
                  type="text" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Cari berdasarkan nama..."
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
              {user.role === UserRole.Enumerator && (
                <label htmlFor="proximity-toggle" className="flex items-center cursor-pointer select-none" title={!currentUserLocation ? "Lokasi Anda dibutuhkan untuk filter ini" : ""}>
                    <span className={`mr-2 text-sm font-medium ${currentUserLocation ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>Terdekat (&lt;{PROXIMITY_THRESHOLD_METERS}m)</span>
                    <div className="relative"><input type="checkbox" id="proximity-toggle" className="sr-only" checked={proximityFilter} onChange={() => setProximityFilter(!proximityFilter)} disabled={!currentUserLocation}/>
                        <div className={`block w-10 h-6 rounded-full transition-colors ${proximityFilter ? 'bg-orange-600' : 'bg-gray-200 dark:bg-gray-600'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${proximityFilter ? 'translate-x-4' : ''}`}></div>
                    </div>
                </label>
              )}
              {isFilterActive && (
                  <button onClick={handleClearFilters} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" title="Hapus Filter">
                      <XCircleIcon className="w-5 h-5" />
                  </button>
              )}
          </div>
        </div>
        <div>
            <div className="inline-flex rounded-md shadow-sm mt-2 sm:mt-0" role="group">
                {statusOptions.map((option) => (
                    <button key={option.value} type="button" onClick={() => setStatusFilter(option.value)}
                        className={`px-3 py-1.5 text-xs font-medium focus:z-10 focus:ring-2 focus:ring-orange-500 transition-colors
                            ${statusFilter === option.value ? 'bg-orange-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}
                            first:rounded-l-lg last:rounded-r-lg border border-gray-200 dark:border-gray-600
                        `}>
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
        {user.role === UserRole.Supervisor && filteredRespondents.length > 0 && (
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <label htmlFor="select-all" className="flex items-center space-x-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                  <input
                      type="checkbox"
                      id="select-all"
                      checked={selectedRespondentIds.size === filteredRespondents.length && filteredRespondents.length > 0}
                      onChange={handleSelectAll}
                      className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-orange-600 focus:ring-orange-500 bg-gray-100 dark:bg-gray-700"
                  />
                  <span>Pilih Semua yang Ditampilkan ({filteredRespondents.length})</span>
              </label>
          </div>
        )}
      </div>
      
      {user.role === UserRole.Supervisor && selectedRespondentIds.size > 0 && (
        <div className="bg-orange-50 dark:bg-gray-700/50 p-3 my-4 rounded-lg flex items-center justify-between shadow-md animate-in fade-in">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{selectedRespondentIds.size} responden dipilih.</p>
            <button
                onClick={handleBulkReview}
                disabled={!canReviewAnySelected}
                title={!canReviewAnySelected ? "Pilih responden berstatus 'Selesai' untuk direview." : "Tandai sebagai Telah Direview"}
                className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-violet-600 px-3 py-1.5 rounded-lg shadow transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
            >
                <ShieldCheckIcon className="h-4 w-4" />
                Tandai sebagai Direview
            </button>
        </div>
      )}

      {user.role === UserRole.Enumerator && !currentUserLocation && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-300 p-4 mb-4 rounded-r-lg shadow" role="alert">
          <p className="font-bold">Layanan Lokasi Tidak Tersedia</p>
          <p className="text-sm">Aktifkan layanan lokasi untuk mengaktifkan fitur berbasis jarak.</p>
        </div>
      )}

      <ul className="space-y-4">
        {filteredRespondents.length > 0 ? (
          filteredRespondents.map(r => {
            const distance = currentUserLocation ? getDistanceInMeters(currentUserLocation, r.location) : null;
            const isWithinProximity = distance !== null && distance <= PROXIMITY_THRESHOLD_METERS;
            const StatusIcon = statusIcons[r.status];
            return (
              <li key={r.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${selectedRespondentIds.has(r.id) ? 'ring-2 ring-orange-500' : (isWithinProximity && user.role === UserRole.Enumerator ? 'ring-2 ring-orange-500/70' : '')}`} style={{borderColor: STATUS_COLORS[r.status]}}>
                <div className="p-4 flex items-start gap-4">
                    {user.role === UserRole.Supervisor && (
                        <input
                            type="checkbox"
                            checked={selectedRespondentIds.has(r.id)}
                            onChange={() => handleSelectRespondent(r.id)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select respondent ${r.name}`}
                            className="mt-1 h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-orange-600 focus:ring-orange-500 bg-gray-100 dark:bg-gray-900"
                        />
                    )}
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{r.name}</h4>
                                    {isWithinProximity && user.role === UserRole.Enumerator && (
                                        <span className="relative flex h-3 w-3" title={`Dalam jangkauan (${distance?.toFixed(0)}m)`}>
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                        </span>
                                    )}
                                </div>
                                
                                {distance !== null && user.role === UserRole.Enumerator && (
                                   <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <LocationMarkerIcon className="h-4 w-4" />
                                            <span>~{distance.toFixed(0)} meter</span>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full text-white flex items-center gap-1.5" style={{ backgroundColor: STATUS_COLORS[r.status] }}>
                                <StatusIcon className="h-3 w-3" />
                                {r.status}
                            </span>
                        </div>
                        <div className="flex items-stretch space-x-2">
                          {user.role === UserRole.Enumerator && r.status === SurveyStatus.NotStarted && (
                             <button onClick={createClickHandler(() => updateRespondentStatus(r.id, SurveyStatus.InProgress))} disabled={!currentUserLocation || !isWithinProximity} className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500" title={!currentUserLocation || !isWithinProximity ? `Anda harus berada dalam jarak ${PROXIMITY_THRESHOLD_METERS}m dari responden.` : 'Mulai Survei'}>
                                Mulai Survei
                             </button>
                          )}
                          {user.role === UserRole.Enumerator && r.status === SurveyStatus.InProgress && (
                             <button onClick={createClickHandler(() => updateRespondentStatus(r.id, SurveyStatus.Completed))} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-all shadow-md hover:shadow-lg" title="Selesaikan Survei">
                                Selesaikan Survei
                             </button>
                          )}
                          {user.role === UserRole.Supervisor && r.status === SurveyStatus.Completed && (
                             <button onClick={createClickHandler(() => updateRespondentStatus(r.id, SurveyStatus.Reviewed))} className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg" title="Tandai sebagai Telah Direview">
                                <ShieldCheckIcon className="h-4 w-4" />
                                <span>Mark as Reviewed</span>
                             </button>
                          )}
                          
                          <button onClick={createClickHandler(() => handleShowRoute(r))} disabled={!currentUserLocation && user.role === UserRole.Enumerator} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" title="Lihat Rute ke Responden">
                              <RouteIcon className="h-4 w-4" />
                              <span>Rute</span>
                          </button>
                          <button onClick={createClickHandler(() => handleCopy(r))} className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg" title="Salin Detail Responden">
                              {copiedId === r.id ? <span>Tersalin!</span> : <><ClipboardIcon className="h-4 w-4" /><span>Salin</span></>}
                          </button>
                        </div>
                    </div>
                </div>
              </li>
            )
          })
        ) : (
            <li className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700">
                Tidak ada responden yang cocok dengan filter saat ini.
            </li>
        )}
      </ul>
    </div>
  );
};

export default RespondentList;