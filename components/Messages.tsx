
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Phone, Video, Camera, Mic, 
  Image as ImageIcon, Heart, Smile, ArrowLeft, X, Upload, Plus, ChevronDown, Search, UserCircle, Bot, Trash2,
  MessageCircle
} from 'lucide-react';
import { Conversation, Message, AppView, User } from '../types';
import { storageService } from '../services/storageService';
import { getAiResponse } from '../services/geminiService';

interface MessagesProps {
  onViewChange: (view: AppView) => void;
}

export const Messages: React.FC<MessagesProps> = ({ onViewChange }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [isAddingNewChat, setIsAddingNewChat] = useState(false);
  const [isEditingOwnName, setIsEditingOwnName] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showNewChatOption, setShowNewChatOption] = useState(false);
  const [reactionMenu, setReactionMenu] = useState<{msgId: string, x: number, y: number, isMe: boolean} | null>(null);
  
  const [editFormData, setEditFormData] = useState<Partial<User & { isAiEnabled?: boolean }>>({});
  const [newChatData, setNewChatData] = useState<Partial<User>>({
    username: '',
    fullName: '',
    avatar: 'https://picsum.photos/seed/default/150/150',
    followers: '0',
    postsCount: '0',
    followingSince: '2026',
    mutualFollows: 'geen'
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newChatFileRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<number | null>(null);

  // Laden van gesprekken bij opstarten
  useEffect(() => {
    const loaded = storageService.getConversations();
    setConversations(loaded);
  }, []);

  // Scroll naar beneden bij updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConvId, conversations, isTyping]);

  // Markeer als gelezen bij selectie
  useEffect(() => {
    if (selectedConvId) {
      const updated = storageService.markAsRead(selectedConvId);
      setConversations(updated);
      setIsTyping(false);
    }
  }, [selectedConvId]);

  const selectedConversation = conversations.find(c => c.id === selectedConvId);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedConvId || !selectedConversation) return;

    const text = inputValue.trim();
    const msgId = Date.now().toString();
    const newMessage: Message = {
      id: msgId,
      senderId: isImpersonating ? selectedConversation.user.id : 'me',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSeen: false
    };

    const updated = storageService.addMessage(selectedConvId, newMessage);
    setConversations(updated);
    setInputValue('');

    if (!isImpersonating) {
      setTimeout(() => {
        const seenUpdated = storageService.markMessageAsSeen(selectedConvId, msgId);
        setConversations(seenUpdated);
      }, 2000);
    }

    if (selectedConversation.isAiEnabled && !isImpersonating) {
      setIsTyping(true);
      // Simuleer nadenktijd
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const aiResponse = await getAiResponse(text, selectedConversation.user.username);
      const aiMsgId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMsgId,
        senderId: selectedConversation.user.id,
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSeen: true
      };
      const aiUpdated = storageService.addMessage(selectedConvId, aiMessage);
      setConversations(aiUpdated);
      // Laat indicator even staan voor realisme
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleConfirmDeleteMessage = () => {
    if (reactionMenu && selectedConvId) {
      if (confirm('Bericht verwijderen voor iedereen?')) {
        const updated = storageService.deleteMessage(selectedConvId, reactionMenu.msgId);
        setConversations(updated);
        setReactionMenu(null);
      }
    }
  };

  const deleteConv = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Gesprek definitief verwijderen?')) {
      const updated = storageService.deleteConversation(id);
      setConversations(updated);
      if (selectedConvId === id) setSelectedConvId(null);
    }
  };

  const handleReaction = (emoji: string) => {
    if (reactionMenu && selectedConvId) {
      const updated = storageService.addReaction(selectedConvId, reactionMenu.msgId, {
        emoji,
        senderId: 'me'
      });
      setConversations(updated);
      setReactionMenu(null);
    }
  };

  const startLongPress = (e: React.MouseEvent | React.TouchEvent, msgId: string, senderId: string) => {
    const x = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    const isMe = senderId === 'me';
    
    longPressTimer.current = window.setTimeout(() => {
      setReactionMenu({ msgId, x, y, isMe });
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const openPartnerSettings = () => {
    if (!selectedConversation) return;
    setEditFormData({ ...selectedConversation.user, isAiEnabled: selectedConversation.isAiEnabled });
    setIsEditingPartner(true);
  };

  const handleSavePartnerProfile = () => {
    if (!selectedConversation) return;
    let updated = storageService.updateUser(selectedConversation.user.id, editFormData);
    if (editFormData.isAiEnabled !== selectedConversation.isAiEnabled) {
      updated = storageService.toggleAiMode(selectedConversation.id);
    }
    setConversations(updated);
    setIsEditingPartner(false);
  };

  const handleCreateNewChat = () => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: newChatData.username || 'gebruiker',
      fullName: newChatData.fullName || 'Nieuwe Gebruiker',
      avatar: newChatData.avatar || 'https://picsum.photos/seed/default/150/150',
      followers: newChatData.followers,
      postsCount: newChatData.postsCount,
      followingSince: newChatData.followingSince,
      mutualFollows: newChatData.mutualFollows,
      isVerified: false
    };
    const updated = storageService.addConversation(newUser);
    setConversations(updated);
    setIsAddingNewChat(false);
    setShowNewChatOption(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'edit' | 'new') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'edit') setEditFormData(prev => ({ ...prev, avatar: reader.result as string }));
        else setNewChatData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'edit')} />
      <input type="file" ref={newChatFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'new')} />

      {/* Interactie Menu */}
      {reactionMenu && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4" onClick={() => setReactionMenu(null)}>
          <div 
            className="bg-zinc-800 rounded-3xl p-5 shadow-2xl border border-zinc-700 animate-in zoom-in-95 flex flex-col gap-5 min-w-[220px]"
            style={{ 
              position: 'absolute',
              top: Math.min(window.innerHeight - 200, reactionMenu.y - 120), 
              left: Math.min(window.innerWidth - 240, Math.max(20, reactionMenu.x - 110)) 
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex gap-2 justify-center">
              {['❤️', '🙌', '😂', '🔥', '👏', '😢'].map(emoji => (
                <button 
                  key={emoji} 
                  className="text-2xl hover:scale-125 transition-transform p-1"
                  onClick={(e) => { e.stopPropagation(); handleReaction(emoji); }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {reactionMenu.isMe && (
              <button 
                onClick={handleConfirmDeleteMessage}
                className="flex items-center justify-center gap-2 text-red-500 font-bold py-3.5 hover:bg-red-500/10 rounded-2xl transition-colors border-t border-zinc-700 mt-1"
              >
                <Trash2 size={18} />
                Bericht verwijderen
              </button>
            )}
          </div>
        </div>
      )}

      {/* Eigen naam aanpassen */}
      {isEditingOwnName && (
        <div className="absolute inset-0 bg-black/95 z-[110] flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-sm rounded-2xl p-6 border border-zinc-800 shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Gebruikersnaam aanpassen</h2>
            <input 
              className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none w-full mb-4 border border-zinc-700" 
              value={storageService.getOwnUsername()} 
              onChange={e => {
                storageService.updateOwnUser({ username: e.target.value });
                setConversations([...storageService.getConversations()]);
              }} 
            />
            <div className="flex gap-2">
              <button onClick={() => setIsEditingOwnName(false)} className="flex-1 bg-zinc-800 py-3 rounded-xl font-bold">Gereed</button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Instellingen */}
      {isEditingPartner && selectedConversation && (
        <div className="absolute inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-sm rounded-2xl p-6 border border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Instellingen aanpassen</h2>
              <button onClick={() => setIsEditingPartner(false)} className="hover:bg-zinc-800 p-1 rounded-full"><X /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center">
                <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                  <img src={editFormData.avatar} className="w-24 h-24 rounded-full object-cover border-2 border-zinc-700 shadow-lg" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                    <Upload size={24} />
                  </div>
                </div>
                <span className="text-xs text-blue-400 mt-2 font-bold cursor-pointer">Foto wijzigen</span>
              </div>
              <input className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none border border-zinc-700" placeholder="Username" value={editFormData.username} onChange={e => setEditFormData({...editFormData, username: e.target.value})} />
              <input className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none border border-zinc-700" placeholder="Volgers" value={editFormData.followers} onChange={e => setEditFormData({...editFormData, followers: e.target.value})} />
              
              <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 mt-2">
                 <div className="flex items-center gap-3">
                    <Bot size={20} className={editFormData.isAiEnabled ? "text-purple-400" : "text-zinc-500"} />
                    <div className="flex flex-col">
                       <span className="text-sm font-bold">AI Reacties</span>
                       <span className="text-[10px] text-zinc-500 leading-tight">Laat AI automatisch antwoorden</span>
                    </div>
                 </div>
                 <button 
                   onClick={() => setEditFormData({...editFormData, isAiEnabled: !editFormData.isAiEnabled})}
                   className={`w-12 h-6 rounded-full relative transition-colors ${editFormData.isAiEnabled ? 'bg-purple-600' : 'bg-zinc-700'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editFormData.isAiEnabled ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>

              <button onClick={handleSavePartnerProfile} className="bg-blue-500 text-white font-bold py-3.5 rounded-xl mt-4 active:scale-95 transition-transform">Opslaan</button>
            </div>
          </div>
        </div>
      )}

      {/* Nieuwe Chat Modal */}
      {isAddingNewChat && (
        <div className="absolute inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 w-full max-sm rounded-2xl p-6 border border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Nieuwe chat starten</h2>
              <button onClick={() => setIsAddingNewChat(false)}><X /></button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center mb-2">
                <div className="relative cursor-pointer" onClick={() => newChatFileRef.current?.click()}>
                  <img src={newChatData.avatar} className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700 shadow-md" />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Upload size={20} />
                  </div>
                </div>
              </div>
              <input className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none" placeholder="Username" onChange={e => setNewChatData({...newChatData, username: e.target.value})} />
              <input className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none" placeholder="Volledige naam" onChange={e => setNewChatData({...newChatData, fullName: e.target.value})} />
              <button onClick={handleCreateNewChat} className="bg-blue-500 text-white font-bold py-3.5 rounded-xl mt-2 active:scale-95 transition-transform">Aanmaken</button>
            </div>
          </div>
        </div>
      )}

      {/* Gesprekkenlijst (Zijbalk) */}
      <div className={`${selectedConvId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[360px] border-r border-zinc-900`}>
        <div className="px-4 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-black z-10">
           <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setIsEditingOwnName(true)}>
              <button onClick={(e) => { e.stopPropagation(); onViewChange(AppView.FEED); }} className="hover:bg-zinc-900 p-1 rounded-full -ml-1 mr-1 transition-colors"><ArrowLeft size={24} /></button>
              <span className="text-xl font-bold tracking-tight group-hover:text-zinc-400 transition-colors truncate max-w-[180px]">
                {storageService.getOwnUsername()}
              </span>
              <div className="relative">
                <ChevronDown size={18} className="text-white mt-1" />
                <div className="absolute top-1 -right-2 w-2 h-2 bg-red-500 rounded-full border border-black"></div>
              </div>
           </div>
        </div>

        <div className="px-4 py-3">
          <div className="bg-zinc-800 flex items-center gap-3 px-3 py-1.5 rounded-xl">
            <Search size={18} className="text-zinc-500" />
            <input type="text" placeholder="Zoeken..." className="bg-transparent border-none outline-none text-[15px] placeholder:text-zinc-500 w-full" />
          </div>
        </div>

        <div className="flex gap-4 px-4 py-2 overflow-x-auto no-scrollbar mb-4">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
            <div className="relative">
              <img src={storageService.getOwnUser().avatar} className="w-[72px] h-[72px] rounded-full object-cover border border-zinc-900 shadow-xl" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center shadow-md">
                 <div className="w-3.5 h-[2px] bg-red-500 rotate-[45deg] relative">
                    <div className="absolute inset-0 bg-red-500 rotate-90"></div>
                 </div>
              </div>
            </div>
            <span className="text-xs text-zinc-500 font-medium">Je notitie</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between px-4 py-2 mb-1">
             <button 
               onClick={() => { setShowNewChatOption(!showNewChatOption); setIsDeleteMode(false); }} 
               className="font-bold text-[15px] hover:text-zinc-400 transition-colors"
             >
               Chatberichten
             </button>
             <button className="text-zinc-500 text-[14px] font-medium hover:text-white transition-colors">Verzoeken</button>
          </div>

          {showNewChatOption && (
            <button 
              onClick={() => setIsAddingNewChat(true)}
              className="w-full py-4 text-blue-500 text-sm font-bold border-b border-zinc-900 hover:bg-zinc-950 transition-all animate-in slide-in-from-top-2"
            >
              + Nieuwe chat starten
            </button>
          )}

          {conversations.map(conv => (
            <div key={conv.id} onClick={() => setSelectedConvId(conv.id)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedConvId === conv.id ? 'bg-zinc-900' : 'hover:bg-zinc-950/50'}`}>
              <div className="relative flex-shrink-0">
                <img src={conv.user.avatar} className="w-14 h-14 rounded-full object-cover shadow-sm border border-zinc-800" />
                {conv.user.isActive && <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full"></div>}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[15px] font-medium truncate">{conv.user.username}</div>
                <div className={`text-[13px] truncate ${conv.unread ? 'text-white font-semibold' : 'text-zinc-500'}`}>
                   {conv.lastMessage} <span className="mx-0.5">·</span> {conv.timestamp}
                </div>
              </div>
              <div className="flex items-center gap-2">
                 {isDeleteMode ? (
                   <button onClick={(e) => deleteConv(e, conv.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-full transition-all">
                     <Trash2 size={18} />
                   </button>
                 ) : (
                   <>
                    {conv.unread && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                    <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center opacity-40">
                        <Camera size={12} />
                    </div>
                   </>
                 )}
              </div>
            </div>
          ))}

          <button 
            onClick={() => setIsDeleteMode(!isDeleteMode)}
            className="w-full py-8 text-zinc-500 text-xs hover:text-red-500 transition-colors uppercase tracking-[0.15em] font-black"
          >
            {isDeleteMode ? 'Gereed' : 'Chats beheren'}
          </button>
        </div>
      </div>

      {/* Chat Venster */}
      <div className={`${selectedConvId ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-black relative shadow-2xl`}>
        {selectedConversation ? (
          <>
            <div className={`flex items-center justify-between px-4 py-3 border-b border-zinc-900 sticky top-0 bg-black z-20 ${isImpersonating ? 'bg-blue-900/10' : ''}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedConvId(null)} className="p-1 -ml-1 md:hidden transition-transform active:scale-90"><ChevronLeft size={30} /></button>
                <div 
                  className="flex items-center gap-3 cursor-pointer select-none" 
                  onClick={() => setIsImpersonating(!isImpersonating)}
                  onDoubleClick={(e) => { e.stopPropagation(); openPartnerSettings(); }}
                >
                  <img src={selectedConversation.user.avatar} className="w-10 h-10 rounded-full object-cover border border-zinc-800 shadow-sm transition-transform active:scale-95" />
                  <div>
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      {selectedConversation.user.username}
                      {selectedConversation.user.isVerified && <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-black shadow-sm">✓</div>}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-medium">
                      {isImpersonating ? (
                        <span className="text-blue-400 flex items-center gap-1"><UserCircle size={10}/> Praten als {selectedConversation.user.username}</span>
                      ) : selectedConversation.isAiEnabled ? (
                        <span className="text-purple-400 flex items-center gap-1"><Bot size={10}/> AI Actief</span>
                      ) : (
                        'Zakelijke chat'
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 pr-1">
                <button className="hover:text-zinc-400 transition-colors"><Phone size={24} /></button>
                <button className="hover:text-zinc-400 transition-colors"><Video size={26} /></button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col no-scrollbar bg-black">
              {/* Context Header */}
              <div className="flex flex-col items-center py-12 text-center border-b border-zinc-900/50 mb-8 animate-in fade-in slide-in-from-top-4">
                <div className="relative mb-4 group cursor-pointer" onClick={openPartnerSettings}>
                   <div className="w-24 h-24 rounded-full border-[3px] border-zinc-800 p-1 bg-black transition-transform group-hover:scale-105">
                      <img src={selectedConversation.user.avatar} className="w-full h-full rounded-full object-cover shadow-2xl" />
                   </div>
                </div>
                <h2 className="text-lg font-bold mb-1">{selectedConversation.user.username}</h2>
                <div className="text-zinc-400 text-xs mb-1 font-medium">{selectedConversation.user.followers || '0'} volgers · {selectedConversation.user.postsCount || '0'} berichten</div>
                <div className="text-zinc-400 text-xs mb-6 font-medium">Je volgt dit account sinds {selectedConversation.user.followingSince || '2024'}</div>
                <div className="flex gap-2 w-full max-w-[320px]">
                   <button className="flex-1 bg-zinc-800/80 hover:bg-zinc-800 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95">Profiel bekijken</button>
                   <button className="flex-1 bg-zinc-800/80 hover:bg-zinc-800 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95">Community</button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {selectedConversation.messages.map((m, idx) => {
                  const isMe = m.senderId === 'me';
                  const isLastMessage = idx === selectedConversation.messages.length - 1;
                  return (
                    <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group animate-in slide-in-from-bottom-2 duration-300`}>
                      <div 
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[14px] relative cursor-pointer select-none transition-all active:scale-[0.97] ${isMe ? 'bg-zinc-800 text-white shadow-md' : 'bg-zinc-900 text-white shadow-sm'}`}
                        onMouseDown={(e) => startLongPress(e, m.id, m.senderId)}
                        onMouseUp={endLongPress}
                        onTouchStart={(e) => startLongPress(e, m.id, m.senderId)}
                        onTouchEnd={endLongPress}
                      >
                        {m.text}
                        {m.reactions && m.reactions.length > 0 && (
                          <div className={`absolute -bottom-3 ${isMe ? 'right-0' : 'left-0'} flex -space-x-1 animate-in zoom-in-50`}>
                            {m.reactions.map((r, i) => (
                              <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-full px-1.5 py-0.5 text-[10px] shadow-2xl">{r.emoji}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      {isMe && isLastMessage && m.isSeen && (
                        <span className="text-[10px] text-zinc-500 mt-1.5 mr-1 font-bold animate-in fade-in">Gezien</span>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex flex-col items-start gap-1 mb-2 animate-in fade-in duration-300">
                    <div className="bg-zinc-900 px-4 py-3 rounded-2xl flex gap-1.5 items-center">
                       <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                       <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                       <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-[10px] text-zinc-500 ml-2 font-bold tracking-tight">typt...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-black border-t border-zinc-900/50">
              <div className={`flex items-center gap-3 px-3 py-1 bg-zinc-900 rounded-[28px] border border-transparent transition-all ${isImpersonating ? 'border-blue-500/40 shadow-blue-500/5 shadow-sm' : selectedConversation.isAiEnabled ? 'border-purple-500/40 shadow-purple-500/5 shadow-sm' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white cursor-pointer active:scale-90 flex-shrink-0 shadow-lg">
                   <Plus size={22} strokeWidth={3} />
                </div>
                <input 
                  className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-zinc-500 py-3" 
                  placeholder={isImpersonating ? `Praten als ${selectedConversation.user.username}...` : "Typ een chatbericht..."} 
                  value={inputValue} 
                  onChange={e => setInputValue(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                />
                <div className="flex items-center gap-4 pr-1">
                  {inputValue.trim() ? (
                    <button onClick={handleSendMessage} className="text-blue-500 font-bold text-sm px-2 active:scale-95 transition-transform">Sturen</button>
                  ) : (
                    <>
                      <Mic size={24} className="text-white cursor-pointer hover:text-zinc-400 transition-colors" />
                      <ImageIcon size={24} className="text-white cursor-pointer hover:text-zinc-400 transition-colors" />
                      <Smile size={24} className="text-white cursor-pointer hover:text-zinc-400 transition-colors" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-10 animate-in fade-in">
            <div className="w-24 h-24 rounded-full border-2 border-zinc-800 flex items-center justify-center mb-6 shadow-inner">
               <MessageCircle size={40} className="text-zinc-700" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Jouw chatberichten</h2>
            <p className="text-sm text-center max-w-[280px] text-zinc-400">Stuur privéfoto's en berichten naar een vriend.</p>
            <button onClick={() => setIsAddingNewChat(true)} className="mt-8 bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-blue-500/20">Chatbericht sturen</button>
          </div>
        )}
      </div>
    </div>
  );
};
