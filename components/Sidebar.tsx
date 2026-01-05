
import React from 'react';
import { 
  Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, Menu,
  Instagram
} from 'lucide-react';
import { AppView } from '../types';
import { storageService } from '../services/storageService';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const isMessageView = activeView === AppView.MESSAGES;
  const ownUser = storageService.getOwnUser();

  const navItems = [
    { id: AppView.FEED, label: 'Startpagina', icon: Home },
    { id: AppView.SEARCH, label: 'Zoeken', icon: Search },
    { id: AppView.EXPLORE, label: 'Verkennen', icon: Compass },
    { id: AppView.REELS, label: 'Reels', icon: Film },
    { id: AppView.MESSAGES, label: 'Berichten', icon: MessageCircle, badge: 1 },
    { id: AppView.NOTIFICATIONS, label: 'Meldingen', icon: Heart },
    { id: AppView.CREATE, label: 'Maken', icon: PlusSquare },
    { id: AppView.PROFILE, label: 'Profiel', icon: () => (
      <img src={ownUser.avatar} alt="Profiel" className="w-6 h-6 rounded-full border border-zinc-700" />
    )},
  ];

  return (
    <div className={`fixed top-0 left-0 h-full border-r border-zinc-800 bg-black flex flex-col px-3 py-5 z-50 transition-all ${isMessageView ? 'w-16' : 'w-16 lg:w-64'}`}>
      <div className="mb-10 px-3">
        <Instagram size={24} className="hover:scale-110 transition-transform cursor-pointer" />
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-zinc-900 group ${
              activeView === item.id ? 'font-bold bg-zinc-900/40' : ''
            }`}
          >
            <div className="flex-shrink-0 group-hover:scale-110 transition-transform relative">
              {typeof item.icon === 'function' ? <item.icon /> : <item.icon size={26} strokeWidth={activeView === item.id ? 3 : 2} />}
              {item.badge && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{item.badge}</div>}
            </div>
            <span className={`hidden ${isMessageView ? 'hidden' : 'lg:block'} text-base`}>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-zinc-900 group">
        <Menu size={26} className="group-hover:scale-110 transition-transform" />
        <span className={`hidden ${isMessageView ? 'hidden' : 'lg:block'} text-base`}>Meer</span>
      </button>
    </div>
  );
};
