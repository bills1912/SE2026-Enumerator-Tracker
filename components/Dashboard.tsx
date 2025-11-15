
import React, { useState, useEffect } from 'react';
import { User, Respondent, Enumerator, SurveyStatus, UserRole } from '../types';
import { INITIAL_RESPONDENTS, INITIAL_ENUMERATORS } from '../constants';
import useGeolocation from '../hooks/useGeolocation';
import Header from './Header';
import Sidebar from './Sidebar';
import MapComponent from './Map';
import Chatbot from './Chatbot';
import { LatLngExpression } from 'leaflet';
import { ChatBubbleIcon, CloseIcon } from './Icons';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [respondents, setRespondents] = useState<Respondent[]>(INITIAL_RESPONDENTS);
  const [enumerators, setEnumerators] = useState<Enumerator[]>(INITIAL_ENUMERATORS);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { position: currentUserLocation, error: geoError } = useGeolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
  });

  useEffect(() => {
    // Simulate real-time updates for enumerator locations
    const interval = setInterval(() => {
        setEnumerators(prevEnumerators =>
            prevEnumerators.map(e => {
                if (!e.location) return e;
                const newLat = (e.location as number[])[0] + (Math.random() - 0.5) * 0.001;
                const newLng = (e.location as number[])[1] + (Math.random() - 0.5) * 0.001;
                return { ...e, location: [newLat, newLng] as LatLngExpression, isMoving: Math.random() > 0.3 };
            })
        );
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  const updateRespondentStatus = (respondentId: string, status: SurveyStatus) => {
    setRespondents(prev =>
      prev.map(r => (r.id === respondentId ? { ...r, status } : r))
    );
  };
  
  const handleAddRespondents = (newRespondents: Omit<Respondent, 'id' | 'status'>[]) => {
    const respondentsWithIds: Respondent[] = newRespondents.map((r, index) => ({
      ...r,
      id: `resp-new-${Date.now()}-${index}`,
      status: SurveyStatus.NotStarted,
    }));
    setRespondents(prev => [...prev, ...respondentsWithIds]);
  };
  
  const userLocationToDisplay = user.role === UserRole.Enumerator ? currentUserLocation : null;
  const isEnumerator = user.role === UserRole.Enumerator;

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-200">
      <Header user={user} onLogout={onLogout} />
      {geoError && <div className="bg-red-500 text-center p-2 text-white">{geoError}</div>}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          user={user} 
          respondents={respondents} 
          enumerators={enumerators}
          updateRespondentStatus={updateRespondentStatus}
          onAddRespondents={handleAddRespondents}
        />
        <main className="flex-1 relative">
          <MapComponent 
            user={user}
            respondents={respondents}
            enumerators={enumerators}
            currentUserLocation={userLocationToDisplay}
          />
           {isEnumerator && (
            <>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-6 right-6 z-[1000] bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-4 shadow-lg transition-transform duration-300 ease-in-out hover:scale-110"
                aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
              >
                {isChatOpen ? <CloseIcon className="h-6 w-6" /> : <ChatBubbleIcon className="h-6 w-6" />}
              </button>
              {isChatOpen && (
                <div className="fixed bottom-24 right-6 z-[1000] w-96 h-96 shadow-2xl rounded-lg bg-gray-800">
                    <Chatbot />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;