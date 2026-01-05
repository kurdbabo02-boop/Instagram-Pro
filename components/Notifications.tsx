
import React, { useState, useRef } from 'react';
import { MOCK_USERS } from '../constants';
import { ChevronRight, ArrowLeft, Heart, X, Upload, Clock, Calendar, Camera } from 'lucide-react';
import { AppView } from '../types';

interface NotificationsProps {
  onViewChange: (view: AppView) => void;
}

type NotificationType = 'follow' | 'like' | 'comment' | 'follow_request';

export const Notifications: React.FC<NotificationsProps> = ({ onViewChange }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customUser, setCustomUser] = useState({
    username: 'gebruiker',
    fullName: '',
    avatar: 'https://picsum.photos/seed/new/150/150'
  });
  const [customTime, setCustomTime] = useState('Nu');
  
  const [items, setItems] = useState([
    { 
      id: 0,
      type: 'follow_request',
      user: MOCK_USERS[1],
      content: '',
      time: 'Nu',
      section: 'Nieuw',
      actionType: 'confirm_delete',
      exactDate: 'Vandaag 12:00'
    },
    { 
      id: 1, 
      type: 'group_follow', 
      users: [MOCK_USERS[0], MOCK_USERS[1]], 
      content: 'vinden je foto leuk.', 
      time: '4d', 
      section: 'Deze week',
      actionType: 'follow',
      exactDate: '24 Januari 2026 14:30'
    },
    { 
      id: 2, 
      type: 'follow_request', 
      user: MOCK_USERS[2], 
      content: '', 
      time: '1w', 
      section: 'Deze maand',
      actionType: 'confirm_delete',
      exactDate: '15 Januari 2026 09:12'
    },
    { 
      id: 3, 
      type: 'follow_request', 
      user: MOCK_USERS[3], 
      content: '', 
      time: '1w', 
      section: 'Deze maand',
      actionType: 'confirm_delete',
      hasStory: true,
      exactDate: '10 Januari 2026 18:45'
    }
  ]);

  const removeNotification = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(null);
    }
  };

  const addNotification = (type: NotificationType) => {
    let newItem: any;
    const userData = {
      id: Date.now().toString(),
      ...customUser
    };
    const now = new Date();
    const exactDate = `${now.getDate()} ${now.toLocaleString('nl-NL', { month: 'long' })} ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;

    switch (type) {
      case 'follow':
        newItem = { id: Date.now(), type, user: userData, content: 'is je gaan volgen.', time: customTime, section: 'Nieuw', actionType: 'follow', exactDate };
        break;
      case 'like':
        newItem = { id: Date.now(), type, user: userData, content: 'vond je foto leuk.', time: customTime, section: 'Nieuw', preview: `https://picsum.photos/seed/p${Date.now()}/100/100`, exactDate };
        break;
      case 'comment':
        newItem = { id: Date.now(), type, user: userData, content: 'reageerde: Geweldig! 🔥', time: customTime, section: 'Nieuw', preview: `https://picsum.photos/seed/p${Date.now()}/100/100`, exactDate };
        break;
      case 'follow_request':
        newItem = { id: Date.now(), type, user: userData, content: '', time: customTime, section: 'Nieuw', actionType: 'confirm_delete', exactDate };
        break;
    }
    
    setItems([newItem, ...items]);
    setShowAddMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomUser(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden relative select-none animate-in fade-in">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      <div className="p-4 flex items-center justify-between bg-black z-20 border-b border-zinc-900 sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={() => onViewChange(AppView.FEED)} className="hover:bg-zinc-900 p-1 rounded-full transition-colors active:scale-90"><ArrowLeft size={24} /></button>
          <h1 className="text-2xl font-bold cursor-pointer hover:text-zinc-400 transition-colors" onClick={() => setShowAddMenu(!showAddMenu)}>Meldingen</h1>
        </div>
      </div>

      {/* Verzoek Details Modal */}
      {selectedRequest && (
        <div className="absolute inset-0 bg-black/95 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedRequest(null)}>
          <div className="bg-zinc-900 w-full max-sm rounded-2xl p-6 border border-zinc-800 shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Informatie</h2>
              <button onClick={() => setSelectedRequest(null)} className="hover:bg-zinc-800 p-1 rounded-full"><X /></button>
            </div>
            <div className="flex flex-col items-center gap-5 py-4">
              <img src={selectedRequest.user?.avatar || selectedRequest.users?.[0]?.avatar} className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover shadow-xl" />
              <div className="text-center">
                <div className="font-bold text-xl">{selectedRequest.user?.username || selectedRequest.users?.[0]?.username}</div>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800 px-5 py-3.5 rounded-xl w-full justify-center border border-zinc-700">
                <Calendar size={18} className="text-blue-500" />
                <span className="text-sm font-bold">{selectedRequest.exactDate}</span>
              </div>
              <div className="flex gap-2 w-full mt-4">
                <button onClick={() => removeNotification(selectedRequest.id)} className="flex-1 bg-blue-500 py-3.5 rounded-xl font-bold active:scale-95 transition-transform text-white">Bevestigen</button>
                <button onClick={() => removeNotification(selectedRequest.id)} className="flex-1 bg-zinc-800 py-3.5 rounded-xl font-bold active:scale-95 transition-transform text-white">Verwijderen</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddMenu && (
        <div className="absolute top-16 left-4 right-4 bg-zinc-900 rounded-xl p-6 shadow-2xl z-50 border border-zinc-800 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Melding toevoegen</h3>
            <button onClick={() => setShowAddMenu(false)} className="hover:text-zinc-400"><X size={20} /></button>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <img src={customUser.avatar} className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700 shadow-md group-hover:opacity-80 transition-opacity" alt="Voorbeeld" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white drop-shadow-md" />
                </div>
              </div>
              <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider cursor-pointer" onClick={() => fileInputRef.current?.click()}>Foto wijzigen</span>
            </div>

            <div className="flex flex-col gap-3">
              <input className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none border border-zinc-700 focus:border-blue-500 transition-colors" placeholder="Gebruikersnaam" value={customUser.username} onChange={e => setCustomUser({...customUser, username: e.target.value})} />
              <input className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none border border-zinc-700 focus:border-blue-500 transition-colors" placeholder="Tijdstip (bijv. 10m)" value={customTime} onChange={e => setCustomTime(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => addNotification('follow_request')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-all">Nieuw Verzoek</button>
              <button onClick={() => addNotification('follow')} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-all">Volger</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div onClick={() => onViewChange(AppView.SEARCH)} className="px-4 py-4 flex items-center justify-between hover:bg-zinc-950 cursor-pointer transition-colors border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <img src={MOCK_USERS[2].avatar} className="w-11 h-11 rounded-full border-2 border-black z-10 object-cover" />
              <img src={MOCK_USERS[3].avatar} className="w-11 h-11 rounded-full border-2 border-black -ml-5 object-cover" />
            </div>
            <div>
              <div className="font-bold text-[15px]">Volgverzoeken</div>
              <div className="text-zinc-500 text-xs">Bekijken</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-lg"></div>
            <ChevronRight size={22} className="text-zinc-500" />
          </div>
        </div>

        {['Nieuw', 'Deze week', 'Deze maand'].map(sectionTitle => {
          const sectionItems = items.filter(item => (item as any).section === sectionTitle);
          if (sectionItems.length === 0) return null;
          return (
            <div key={sectionTitle} className="p-4 border-b border-zinc-900">
              <h3 className="font-bold text-[16px] mb-4">{sectionTitle}</h3>
              <div className="flex flex-col gap-6">
                {sectionItems.map((item) => (
                  <div key={item.id} className="cursor-pointer active:scale-[0.99] transition-all">
                     <NotificationItem 
                        {...item} 
                        onConfirm={() => removeNotification(item.id)}
                        onDelete={() => removeNotification(item.id)}
                        onViewDetails={() => setSelectedRequest(item)}
                     />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NotificationItem = ({ user, users, content, time, preview, actionType, hasStory, onConfirm, onDelete, onViewDetails, type }: any) => {
  const displayUser = user || (users && users[0]);
  
  const handleAction = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

  const isFollowRequest = type === 'follow_request';

  return (
    <div className="flex items-center justify-between gap-3 group" onClick={onViewDetails}>
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <div className="relative flex-shrink-0">
          {users && users.length > 1 ? (
            <div className="relative w-11 h-11">
              <img src={users[0].avatar} className="w-8 h-8 rounded-full border border-black absolute top-0 left-0 z-10 object-cover shadow-md" />
              <img src={users[1].avatar} className="w-8 h-8 rounded-full border border-black absolute bottom-0 right-0 object-cover shadow-md" />
            </div>
          ) : (
            <div className={`p-[1.5px] rounded-full ${hasStory ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 shadow-sm' : ''}`}>
              <div className="bg-black p-[1.5px] rounded-full">
                <img src={displayUser.avatar} className="w-11 h-11 rounded-full object-cover shadow-sm" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="text-sm leading-tight flex items-center gap-1.5 overflow-hidden flex-wrap md:flex-nowrap">
            <span className="font-bold hover:underline cursor-pointer truncate">{users ? `${users[0].username} en ${users[1].username}` : displayUser.username}</span>
            {isFollowRequest ? (
              <>
                <span className="text-zinc-100 whitespace-nowrap">wil je</span>
                {/* Desktop Buttons (PC) - Direct achter 'wil je' met exact dezelfde styling als standaardknoppen */}
                <div className="hidden md:flex gap-2 ml-1 items-center">
                  <button 
                    onClick={(e) => handleAction(e, onConfirm)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors active:scale-95 whitespace-nowrap"
                  >
                    Bevestigen
                  </button>
                  <button 
                    onClick={(e) => handleAction(e, onDelete)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors active:scale-95 whitespace-nowrap"
                  >
                    Verwijderen
                  </button>
                </div>
              </>
            ) : (
              content && <span className="text-zinc-100 truncate">{content}</span>
            )}
            {!isFollowRequest && <span className="text-zinc-500 font-medium flex-shrink-0">{time}</span>}
          </div>
          {isFollowRequest && (
            <div className="text-sm leading-tight text-zinc-100 flex items-center gap-1.5">
              <span>volgen.</span>
              <span className="text-zinc-500 font-medium">{time}</span>
            </div>
          )}
        </div>
      </div>

      {preview && <img src={preview} className="w-11 h-11 object-cover rounded-sm flex-shrink-0 shadow-sm border border-zinc-900" />}
      
      {!preview && actionType && (
        <div className={`flex gap-2 flex-shrink-0 ${isFollowRequest ? 'md:hidden' : ''}`}>
           <button 
             onClick={(e) => handleAction(e, onConfirm)}
             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors active:scale-95"
           >
             Bevestigen
           </button>
           <button 
             onClick={(e) => handleAction(e, onDelete)}
             className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors active:scale-95"
           >
             Verwijderen
           </button>
        </div>
      )}
    </div>
  );
};
