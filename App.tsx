import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import Chatbot from './features/Chatbot';
import ImageSuite from './features/ImageSuite';
import TextPlayground from './features/TextPlayground';
import { Welcome } from './features/Welcome';
import { Feature, UserRole } from './types';
import { ApiKeyManager } from './components/ApiKeyManager';
import VideoSuite from './features/VideoSuite';
import AudioSuite from './features/AudioSuite';
import GroundedSearch from './features/GroundedSearch';
import MediaAnalyzer from './features/MediaAnalyzer';
import AppBuilder from './features/AppBuilder';
import SmartEditor from './features/SmartEditor';
import AgentCenter from './features/AgentCenter';
import MarketingMaestro from './features/MarketingMaestro';
import GeoCommander from './features/GeoCommander';
import SystemCore from './features/SystemCore';
import CloudManager from './features/CloudManager';
import VisionArchitect from './features/VisionArchitect';
import GlobalConnect from './features/GlobalConnect';
import QuranSuite from './features/QuranSuite';
import FinanceManager from './features/FinanceManager';
import Settings from './features/Settings';
import AdNetwork from './features/AdNetwork';
import Legal from './features/Legal';
import { Auth } from './features/Auth';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [intendedFeature, setIntendedFeature] = useState<Feature | null>(null);
  const [isApiKeyNeeded, setIsApiKeyNeeded] = useState(false);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  
  // Auth State
  const [userRole, setUserRole] = useState<UserRole>('guest'); // guest, user, owner

  const handleLogin = (role: 'user' | 'owner') => {
    setUserRole(role);
  };

  const handleSelectFeature = useCallback((feature: Feature) => {
    // Special Pages Routing
    if (feature.id === 'logout') {
      setUserRole('guest');
      setActiveFeature(null);
      return;
    }

    // These features require a paid API key
    const needsKey = ['image-suite', 'video-suite', 'marketing-maestro', 'geo-commander', 'cloud-manager', 'vision-architect', 'global-connect', 'quran-suite', 'finance-manager'].includes(feature.id);
    
    setIsApiKeyNeeded(needsKey);
    if (needsKey && !apiKeyReady) {
      setIntendedFeature(feature);
      setActiveFeature(null);
    } else {
      setActiveFeature(feature);
      setIntendedFeature(null);
    }
  }, [apiKeyReady]);
  
  // If not logged in, show Auth Screen
  if (userRole === 'guest') {
    return <Auth onLogin={handleLogin} />;
  }

  const renderFeature = () => {
    if (isApiKeyNeeded && !apiKeyReady) {
       return <ApiKeyManager onKeyReady={() => {
         setApiKeyReady(true);
         if (intendedFeature) handleSelectFeature(intendedFeature);
       }} />;
    }

    if (!activeFeature) return <Welcome />;

    switch (activeFeature.id) {
      // --- NEW PAGES ---
      case 'settings': return <Settings role={userRole} />;
      case 'ads': return <AdNetwork />;
      case 'privacy': return <Legal page="privacy" />;
      case 'terms': return <Legal page="terms" />;
      case 'about': return <Legal page="about" />;
      
      // --- EXISTING FEATURES ---
      case 'finance-manager': return <FinanceManager />;
      case 'quran-suite': return <QuranSuite />;
      case 'global-connect': return <GlobalConnect />;
      case 'vision-architect': return <VisionArchitect />;
      case 'system-core': return <SystemCore />;
      case 'cloud-manager': return <CloudManager />;
      case 'chatbot': return <Chatbot />;
      case 'marketing-maestro': return <MarketingMaestro />;
      case 'geo-commander': return <GeoCommander />;
      case 'agent-center': return <AgentCenter />;
      case 'smart-editor': return <SmartEditor />;
      case 'text-playground': return <TextPlayground />;
      case 'app-builder': return <AppBuilder />;
      case 'image-suite': return <ImageSuite />;
      case 'video-suite': return <VideoSuite />;
      case 'audio-suite': return <AudioSuite />;
      case 'grounded-search': return <GroundedSearch />;
      case 'media-analyzer': return <MediaAnalyzer />;
      default: return <Welcome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      <Sidebar onSelectFeature={handleSelectFeature} activeFeatureId={activeFeature?.id} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-gray-900 to-black relative">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-5 grid-bg pointer-events-none"></div>
        <div className="relative z-10">
          {renderFeature()}
        </div>
      </main>
    </div>
  );
};

export default App;