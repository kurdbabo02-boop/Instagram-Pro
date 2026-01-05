
import React from 'react';
import { Home, Search, Film, Send, User } from 'lucide-react';
import { AppView } from '../types';
import { CURRENT_USER } from '../constants';

interface BottomNavProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[50px] bg-black border-t border-zinc-900 flex items-center justify-around px-2 z-50">
      <button onClick={() => onViewChange(AppView.FEED)} className="flex-1 flex justify-center">
        <Home size={26} fill={activeView === AppView.FEED ? 'white' : 'none'} strokeWidth={2} className={activeView === AppView.FEED ? 'text-white' : 'text-white'} />
      </button>
      
      <button onClick={() => onViewChange(AppView.REELS)} className="flex-1 flex justify-center">
        <Film size={26} strokeWidth={2} className={activeView === AppView.REELS ? 'text-white' : 'text-white'} />
      </button>
      
      <button onClick={() => onViewChange(AppView.MESSAGES)} className="flex-1 flex justify-center">
        <Send size={26} strokeWidth={2} className={`${activeView === AppView.MESSAGES ? 'text-white' : 'text-white'} rotate-[-10deg]`} />
      </button>
      
      <button onClick={() => onViewChange(AppView.EXPLORE)} className="flex-1 flex justify-center">
        <Search size={26} strokeWidth={activeView === AppView.EXPLORE ? 3 : 2} className={activeView === AppView.EXPLORE ? 'text-white' : 'text-white'} />
      </button>
      
      <button onClick={() => onViewChange(AppView.PROFILE)} className="flex-1 flex justify-center relative">
        <div className="relative">
          <img 
            src={CURRENT_USER.avatar} 
            alt="Profile" 
            className={`w-[26px] h-[26px] rounded-full border ${activeView === AppView.PROFILE ? 'border-white p-[1px]' : 'border-transparent'}`} 
          />
          {/* Red notification dot on profile as seen in screenshot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black"></div>
        </div>
      </button>
    </div>
  );
};
