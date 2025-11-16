import React, { useState, useEffect } from 'react';
import { User, Respondent, Enumerator, SurveyStatus, UserRole, ChatMessage, ChatMode } from '../types';
import { INITIAL_RESPONDENTS, INITIAL_ENUMERATORS } from '../constants';
import useGeolocation from '../hooks/useGeolocation';
import Sidebar from './Sidebar';
import MapComponent from './Map';
import Chatbot from './Chatbot';
import Stats from './Stats';
import SupervisorChatView from './SupervisorChatView';
import ManagementView from './ManagementView';
import RespondentList from './RespondentList';
import { LatLngExpression } from 'leaflet';
import { ChatBubbleIcon, CloseIcon, MenuIcon } from './Icons';
import { getChatbotResponse } from '../services/geminiService';

type Theme = 'light' | 'dark' | 'system';
type SupervisorView = 'dashboard' | 'map' | 'management' | 'chat';
type EnumeratorView = 'tasks' | 'map';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, theme, setTheme }) => {
  const [respondents, setRespondents] = useState<Respondent[]>(INITIAL_RESPONDENTS);
  const [enumerators, setEnumerators] = useState<Enumerator[]>(INITIAL_ENUMERATORS);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Active view state
  const [supervisorView, setSupervisorView] = useState<SupervisorView>('dashboard');
  const [enumeratorView, setEnumeratorView] = useState<EnumeratorView>('tasks');


  // Chat state
  const [chatMode, setChatMode] = useState<ChatMode>('ai');
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({}); // Key: enumeratorId
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { position: currentUserLocation, error: geoError } = useGeolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
  });

  // Sync current enumerator's location with the main enumerators state
  useEffect(() => {
    if (user.role === UserRole.Enumerator && currentUserLocation) {
      setEnumerators(prevEnumerators =>
        prevEnumerators.map(e =>
          e.id === user.id ? { ...e, location: currentUserLocation, isMoving: true } : e
        )
      );
    }
  }, [currentUserLocation, user.id, user.role]);


  // Simulate real-time updates for OTHER enumerator locations (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
        setEnumerators(prevEnumerators =>
            prevEnumerators.map(e => {
                if (e.id === user.id) return e;
                if (!e.location) return e;
                
                const newLat = (e.location as number[])[0] + (Math.random() - 0.5) * 0.001;
                const newLng = (e.location as number[])[1] + (Math.random() - 0.5) * 0.001;
                return { ...e, location: [newLat, newLng] as LatLngExpression, isMoving: Math.random() > 0.3 };
            })
        );
    }, 5000);

    return () => clearInterval(interval);
  }, [user.id]);
  
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

  const handleSendAiMessage = async (input: string) => {
    const userMessage: ChatMessage = { role: 'user', content: input };
    setAiMessages(prev => [...prev, userMessage]);
    setIsAiLoading(true);

    try {
      const response = await getChatbotResponse(input);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setAiMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { role: 'model', content: 'An error occurred. Please try again.' };
      setAiMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendSupervisorMessage = (input: string) => {
    if (user.role !== UserRole.Enumerator) return;
    const userMessage: ChatMessage = { role: 'user', content: input };
    setChatHistories(prev => ({
        ...prev,
        [user.id]: [...(prev[user.id] || []), userMessage]
    }));
  };
  
  const handleSupervisorReply = (enumeratorId: string, input: string) => {
    const supervisorMessage: ChatMessage = { role: 'supervisor', content: input };
     setChatHistories(prev => ({
        ...prev,
        [enumeratorId]: [...(prev[enumeratorId] || []), supervisorMessage]
    }));
  };

  const isEnumerator = user.role === UserRole.Enumerator;
  const enumeratorSupervisorMessages = isEnumerator ? chatHistories[user.id] || [] : [];
  
  const renderSupervisorContent = () => {
    switch(supervisorView) {
        case 'dashboard': return <Stats respondents={respondents} />;
        case 'map': return <MapComponent user={user} respondents={respondents} enumerators={enumerators} currentUserLocation={null} />;
        case 'management': return <ManagementView enumerators={enumerators} onUpload={handleAddRespondents} />;
        case 'chat': return <SupervisorChatView enumerators={enumerators} chatHistories={chatHistories} onReply={handleSupervisorReply} />;
        default: return <Stats respondents={respondents} />;
    }
  }

  const renderEnumeratorContent = () => {
     switch(enumeratorView) {
        case 'tasks': return <RespondentList enumeratorId={user.id} respondents={respondents} updateRespondentStatus={updateRespondentStatus} currentUserLocation={currentUserLocation} />;
        case 'map': return <MapComponent user={user} respondents={respondents} enumerators={enumerators} currentUserLocation={currentUserLocation} />;
        default: return <RespondentList enumeratorId={user.id} respondents={respondents} updateRespondentStatus={updateRespondentStatus} currentUserLocation={currentUserLocation}/>;
     }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Sidebar 
          user={user}
          onLogout={onLogout}
          theme={theme}
          setTheme={setTheme}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          setSupervisorView={setSupervisorView}
          setEnumeratorView={setEnumeratorView}
          activeSupervisorView={supervisorView}
          activeEnumeratorView={enumeratorView}
          isMobileOpen={isMobileSidebarOpen}
          setMobileOpen={setIsMobileSidebarOpen}
      />
      
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <div className={`relative z-0 flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <header className="md:hidden flex-shrink-0 sticky top-0 bg-white dark:bg-gray-900 z-30 p-2 border-b dark:border-gray-700 flex items-center">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300"
              aria-label="Open menu"
            >
                <MenuIcon className="h-6 w-6"/>
            </button>
            <div className="flex-grow text-center font-bold">
                SE2026 Monitor
            </div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">
          {geoError && <div className="bg-red-500 text-center p-2 text-white flex-shrink-0">{geoError}</div>}
          <div className="p-4 md:p-6 flex-grow overflow-y-auto">
              {user.role === UserRole.Supervisor ? renderSupervisorContent() : renderEnumeratorContent()}
          </div>
        </main>
      </div>


      {isEnumerator && (
        <>
            <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            // FIX: Changed chat button color to orange theme
            className="fixed bottom-6 right-6 z-[1000] bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-lg transition-transform duration-300 ease-in-out hover:scale-110"
            aria-label={isChatOpen ? 'Tutup obrolan' : 'Buka obrolan'}
            >
            {isChatOpen ? <CloseIcon className="h-6 w-6" /> : <ChatBubbleIcon className="h-6 w-6" />}
            </button>
            {isChatOpen && (
            <div className="fixed bottom-24 right-6 z-[1000] w-96 h-[30rem] shadow-2xl rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-[calc(100vw-3rem)]">
                <Chatbot
                    chatMode={chatMode}
                    setChatMode={setChatMode}
                    aiMessages={aiMessages}
                    supervisorMessages={enumeratorSupervisorMessages}
                    onSendAiMessage={handleSendAiMessage}
                    onSendSupervisorMessage={handleSendSupervisorMessage}
                    isLoading={isAiLoading}
                />
            </div>
            )}
        </>
       )}
    </div>
  );
};

export default Dashboard;