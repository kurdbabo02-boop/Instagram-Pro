
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { Explore } from './components/Explore';
import { Profile } from './components/Profile';
import { Messages } from './components/Messages';
import { Notifications } from './components/Notifications';
import { BottomNav } from './components/BottomNav';
import { AppView } from './types';
import { CURRENT_USER } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.FEED);

  const renderView = () => {
    switch (activeView) {
      case AppView.FEED:
        return <Feed onViewChange={setActiveView} />;
      case AppView.EXPLORE:
        return <Explore />;
      case AppView.MESSAGES:
        return <Messages onViewChange={setActiveView} />;
      case AppView.NOTIFICATIONS:
        return <Notifications onViewChange={setActiveView} />;
      case AppView.PROFILE:
        return <Profile user={CURRENT_USER} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
            <p>This section is under development for the 2026 update.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar for Desktop/Tablet - Hidden on mobile if in Messages view */}
      <div className={`hidden md:block ${activeView === AppView.MESSAGES ? 'lg:w-16' : ''}`}>
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 w-full transition-all ${
        activeView === AppView.MESSAGES 
          ? 'md:ml-16 pb-0 max-w-none' 
          : 'max-w-4xl pb-16 md:pb-0 md:ml-16 lg:ml-64 mx-auto'
      }`}>
        {renderView()}
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className={`md:hidden ${activeView === AppView.MESSAGES || activeView === AppView.NOTIFICATIONS ? 'hidden' : ''}`}>
        <BottomNav activeView={activeView} onViewChange={setActiveView} />
      </div>
    </div>
  );
};

export default App;
