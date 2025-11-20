

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Respondent, Enumerator, SurveyStatus, UserRole, ChatMessage, ChatMode, Notification, NotificationType } from '../types';
import { INITIAL_RESPONDENTS, INITIAL_ENUMERATORS, USERS } from '../constants';
import useGeolocation from '../hooks/useGeolocation';
import Sidebar from './Sidebar';
import MapComponent from './Map';
import Chatbot from './Chatbot';
import Stats from './Stats';
import SupervisorChatView from './SupervisorChatView';
import ManagementView from './ManagementView';
import RespondentList from './RespondentList';
import NotificationsPanel from './NotificationsPanel';
import { LatLngExpression } from 'leaflet';
import { ChatBubbleIcon, CloseIcon, MenuIcon } from './Icons';
import { getChatbotResponse } from '../services/geminiService';
import { getDistanceInMeters, normalizeLatLng } from '../utils';
import ConnectivityIndicator from './ConnectivityIndicator';

type Theme = 'light' | 'dark' | 'system';
type SupervisorView = 'dashboard' | 'map' | 'respondents' | 'management' | 'chat';
type EnumeratorView = 'tasks' | 'map';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const PROXIMITY_THRESHOLD_METERS = 50;

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, theme, setTheme }) => {
  const [respondents, setRespondents] = useState<Respondent[]>(INITIAL_RESPONDENTS);
  const [enumerators, setEnumerators] = useState<Enumerator[]>(INITIAL_ENUMERATORS);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Active view state
  const [supervisorView, setSupervisorView] = useState<SupervisorView>('dashboard');
  const [enumeratorView, setEnumeratorView] = useState<EnumeratorView>('tasks');

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [sentProximityAlerts, setSentProximityAlerts] = useState<Set<string>>(new Set());


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
  
  const supervisorId = useMemo(() => USERS.find(u => u.role === UserRole.Supervisor)?.id, []);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Keep last 100
  }, []);

  // This effect updates the logged-in enumerator's view and WRITES their location to localStorage
  useEffect(() => {
    if (user.role === UserRole.Enumerator && currentUserLocation) {
      // Update local state for the enumerator's own view
      setEnumerators(prevEnumerators =>
        prevEnumerators.map(e =>
          e.id === user.id ? { ...e, location: currentUserLocation, isMoving: true } : e
        )
      );
      // Write location and timestamp to localStorage for the supervisor to read
      localStorage.setItem(`location_${user.id}`, JSON.stringify({ 
          location: currentUserLocation, 
          timestamp: Date.now() 
      }));
    }
  }, [currentUserLocation, user.id, user.role]);


  // This effect runs only for the supervisor to poll for live locations and simulate others
  useEffect(() => {
    if (user.role !== UserRole.Supervisor) return;

    const interval = setInterval(() => {
        setEnumerators(prevEnumerators =>
            prevEnumerators.map(e => {
                // For John Doe, prioritize live data if it's recent
                if (e.id === 'enumerator-1') {
                    const locationDataRaw = localStorage.getItem('location_enumerator-1');
                    if (locationDataRaw) {
                        try {
                            const { location, timestamp } = JSON.parse(locationDataRaw);
                            // If data is fresh (e.g., < 15s old), use it and stop here for this enumerator.
                            if (Date.now() - timestamp < 15000) {
                                const previousLocation = normalizeLatLng(e.location);
                                const newLocation = normalizeLatLng(location);
                                const isMoving = previousLocation && newLocation 
                                    ? getDistanceInMeters(previousLocation, newLocation) > 1 
                                    : true;
                                return { ...e, location, isMoving };
                            }
                        } catch (err) {
                            // Malformed data, fall through to simulation
                            console.error("Error parsing John Doe's location, falling back to simulation.", err);
                        }
                    }
                    // If no fresh data, fall through to the simulation logic below
                }
                
                // --- Simulation Logic (applies to all enumerators without fresh live data) ---
                if (!e.location) return { ...e, isMoving: false };

                const targetRespondent = respondents.find(
                    r => r.enumeratorId === e.id && r.status === SurveyStatus.NotStarted
                );

                if (targetRespondent) {
                    const currentPos = normalizeLatLng(e.location);
                    const targetPos = normalizeLatLng(targetRespondent.location);

                    if (!currentPos || !targetPos) {
                        return { ...e, isMoving: false };
                    }
                    
                    const distance = getDistanceInMeters(currentPos, targetPos);

                    if (distance < 20) {
                        return { ...e, isMoving: false };
                    }

                    const stepFactor = 0.05;
                    const deltaLat = targetPos[0] - currentPos[0];
                    const deltaLng = targetPos[1] - currentPos[1];

                    const newLat = currentPos[0] + deltaLat * stepFactor;
                    const newLng = currentPos[1] + deltaLng * stepFactor;

                    return { ...e, location: [newLat, newLng], isMoving: true };
                } else {
                    return { ...e, isMoving: false };
                }
            })
        );
    }, 2000);

    return () => {
        clearInterval(interval);
    };
  }, [user.role, respondents]);
  
  // Proximity notification logic
  useEffect(() => {
    if (user.role !== UserRole.Supervisor || !supervisorId) return;

    const newAlerts = new Set(sentProximityAlerts);
    let hasChanged = false;

    enumerators.forEach(enumerator => {
      if (!enumerator.location) return;
      const assigned = respondents.filter(r => r.enumeratorId === enumerator.id && r.status !== SurveyStatus.Completed);
      
      assigned.forEach(respondent => {
        const key = `${enumerator.id}-${respondent.id}`;
        const distance = getDistanceInMeters(enumerator.location!, respondent.location);

        if (distance <= PROXIMITY_THRESHOLD_METERS) {
          if (!newAlerts.has(key)) {
            addNotification({
              type: NotificationType.Proximity,
              message: `${enumerator.name} is approaching respondent ${respondent.name}.`,
              recipientId: supervisorId,
              relatedRespondentId: respondent.id,
            });
            newAlerts.add(key);
            hasChanged = true;
          }
        } else {
          if (newAlerts.has(key)) {
            newAlerts.delete(key);
            hasChanged = true;
          }
        }
      });
    });

    if (hasChanged) {
      setSentProximityAlerts(newAlerts);
    }
  }, [enumerators, respondents, user.role, addNotification, sentProximityAlerts, supervisorId]);
  
  const updateRespondentStatus = (respondentId: string, status: SurveyStatus) => {
    const respondent = respondents.find(r => r.id === respondentId);
    if (!respondent) return;

    setRespondents(prev =>
      prev.map(r => (r.id === respondentId ? { ...r, status } : r))
    );

    if (status === SurveyStatus.Completed && user.role === UserRole.Enumerator) {
        if (supervisorId) {
            const enumerator = enumerators.find(e => e.id === respondent.enumeratorId);
            if (enumerator) {
                addNotification({
                    type: NotificationType.Completion,
                    message: `${enumerator.name} has completed the survey for ${respondent.name}.`,
                    recipientId: supervisorId,
                    relatedRespondentId: respondent.id
                });
            }
        }
    }
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
    const currentHistory = chatHistories[user.id] || [];
    
    // If it's the first message from this enumerator, trigger a notification for the supervisor
    if (currentHistory.length === 0 && supervisorId) {
        addNotification({
            type: NotificationType.Issue,
            message: `${user.name} has sent a new message.`,
            recipientId: supervisorId,
            senderName: user.name,
        });
    }

    setChatHistories(prev => ({
        ...prev,
        [user.id]: [...currentHistory, userMessage]
    }));
  };
  
  const handleSupervisorReply = (enumeratorId: string, input: string) => {
    const supervisorMessage: ChatMessage = { role: 'supervisor', content: input };
     setChatHistories(prev => ({
        ...prev,
        [enumeratorId]: [...(prev[enumeratorId] || []), supervisorMessage]
    }));
    // Add notification for the enumerator
    addNotification({
        type: NotificationType.SupervisorReply,
        message: `You have a new message from your supervisor.`,
        recipientId: enumeratorId,
        senderName: user.name,
    });
  };

  const handleBroadcast = (message: string) => {
    if (user.role !== UserRole.Supervisor) return;
    const enumeratorIds = enumerators.map(e => e.id);
    enumeratorIds.forEach(id => {
      addNotification({
        type: NotificationType.SystemUpdate,
        message: message,
        recipientId: id,
        senderName: user.name,
      });
    });
  };
  
  const handleClearNotifications = () => {
    // Only remove notifications intended for the current user
    setNotifications(prev => prev.filter(n => n.recipientId !== user.id));
  };
  
  const myNotifications = useMemo(() => notifications.filter(n => n.recipientId === user.id), [notifications, user.id]);
  const unreadNotificationsCount = useMemo(() => myNotifications.filter(n => !n.isRead).length, [myNotifications]);

  const isEnumerator = user.role === UserRole.Enumerator;
  const enumeratorSupervisorMessages = isEnumerator ? chatHistories[user.id] || [] : [];
  
  const respondentsForMap = useMemo(() => {
    if (user.role === UserRole.Supervisor) {
      return respondents;
    }
    return respondents.filter(r => r.enumeratorId === user.id);
  }, [respondents, user.role, user.id]);

  const renderSupervisorContent = () => {
    switch(supervisorView) {
        case 'dashboard': return <Stats user={user} respondents={respondents} />;
        case 'map': return <MapComponent user={user} respondents={respondentsForMap} enumerators={enumerators} currentUserLocation={null} />;
        case 'respondents': return <RespondentList user={user} respondents={respondents} updateRespondentStatus={updateRespondentStatus} currentUserLocation={null} />;
        case 'management': return <ManagementView user={user} enumerators={enumerators} onUpload={handleAddRespondents} onBroadcast={handleBroadcast} />;
        case 'chat': return <SupervisorChatView user={user} enumerators={enumerators} chatHistories={chatHistories} onReply={handleSupervisorReply} />;
        default: return <Stats user={user} respondents={respondents} />;
    }
  }

  const renderEnumeratorContent = () => {
     switch(enumeratorView) {
        case 'tasks': return <RespondentList user={user} respondents={respondents} updateRespondentStatus={updateRespondentStatus} currentUserLocation={currentUserLocation} />;
        case 'map': return <MapComponent user={user} respondents={respondentsForMap} enumerators={enumerators} currentUserLocation={currentUserLocation} />;
        default: return <RespondentList user={user} respondents={respondents} updateRespondentStatus={updateRespondentStatus} currentUserLocation={currentUserLocation}/>;
     }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black overflow-hidden">
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
          unreadNotifications={unreadNotificationsCount}
          onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
      />
      
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={myNotifications}
        onClearAll={handleClearNotifications}
      />

      <div className={`relative z-0 flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <header className="md:hidden flex-shrink-0 sticky top-0 bg-white dark:bg-gray-900 z-30 p-2 border-b dark:border-gray-700 flex items-center justify-between">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300"
              aria-label="Open menu"
            >
                <MenuIcon className="h-6 w-6"/>
            </button>
            <div className="font-bold text-base">
                {user.role === UserRole.Enumerator 
                    ? <ConnectivityIndicator /> 
                    : <span>SE2026 Monitor</span>
                }
            </div>
            {/* Right-side placeholder to balance the header and perfectly center the middle element */}
            <div className="w-10"></div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900/50 relative">
            {geoError && <div className="bg-red-500 text-center p-2 text-white flex-shrink-0">{geoError}</div>}
            <div className="p-4 md:p-6 flex-grow overflow-y-auto relative z-10">
              {user.role === UserRole.Supervisor ? renderSupervisorContent() : renderEnumeratorContent()}
            </div>
        </main>
      </div>


      {isEnumerator && (
        <>
            <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-6 right-6 z-[1000] bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-800"
            aria-label={isChatOpen ? 'Tutup obrolan' : 'Buka obrolan'}
            >
            {isChatOpen ? <CloseIcon className="h-6 w-6" /> : <ChatBubbleIcon className="h-6 w-6" />}
            </button>
            {isChatOpen && (
            <div className="fixed bottom-24 right-6 z-[1000] w-96 h-[32rem] shadow-2xl rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-[calc(100vw-3rem)] transform transition-all duration-300 ease-in-out origin-bottom-right animate-in fade-in slide-in-from-bottom-5">
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