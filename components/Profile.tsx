
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { Settings, Grid, Bookmark, Tag, X, Upload } from 'lucide-react';
import { storageService } from '../services/storageService';

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState(storageService.getOwnUser());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [activeTab, setActiveTab] = useState('posts');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const posts = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/profile${i}/600/600`
  }));

  const handleSaveProfile = () => {
    const updated = storageService.updateOwnUser(editForm);
    setProfile(updated);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto relative min-h-screen bg-black text-white">
      {/* Profiel Bewerken Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-2xl p-6 border border-zinc-800 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Profiel bewerken</h2>
              <button onClick={() => setIsEditing(false)} className="hover:bg-zinc-800 p-1 rounded-full"><X /></button>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center">
                <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                  <img src={editForm.avatar} className="w-24 h-24 rounded-full object-cover border-2 border-zinc-700 shadow-xl" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                    <Upload size={24} />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <span className="text-xs text-blue-400 mt-2 font-bold cursor-pointer hover:underline">Foto wijzigen</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500 font-bold px-1">Gebruikersnaam</label>
                <input className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none w-full border border-zinc-700" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500 font-bold px-1">Volledige naam</label>
                <input className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none w-full border border-zinc-700" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500 font-bold px-1">Website</label>
                <input className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none w-full border border-zinc-700" value={editForm.website} onChange={e => setEditForm({...editForm, website: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500 font-bold px-1">Bio</label>
                <textarea 
                  className="bg-zinc-800 p-3.5 rounded-xl text-sm outline-none w-full h-24 resize-none border border-zinc-700" 
                  value={editForm.bio} 
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                />
              </div>

              <button onClick={handleSaveProfile} className="bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 active:scale-95 transition-all shadow-lg shadow-blue-500/20">Opslaan</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-6 md:gap-20 mb-10">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 shadow-xl">
            <div className="w-full h-full rounded-full border-4 border-black bg-zinc-900 overflow-hidden">
               <img src={profile.avatar} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="flex-1 pt-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <h2 className="text-xl font-medium tracking-tight">{profile.username}</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => { setEditForm(profile); setIsEditing(true); }}
                className="bg-zinc-800 hover:bg-zinc-700 px-5 py-2 rounded-lg font-bold text-sm transition-colors active:scale-95"
              >
                Profiel bewerken
              </button>
              <button className="p-2 hover:bg-zinc-900 rounded-lg transition-colors active:scale-90">
                <Settings size={20} />
              </button>
            </div>
          </div>

          <div className="hidden md:flex gap-10 mb-6">
            <div className="text-[15px]"><span className="font-bold">{posts.length}</span> berichten</div>
            <div className="text-[15px]"><span className="font-bold">12.5k</span> volgers</div>
            <div className="text-[15px]"><span className="font-bold">842</span> volgend</div>
          </div>

          <div className="hidden md:block">
            <div className="font-bold text-sm mb-1">{profile.fullName}</div>
            <div className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">{profile.bio}</div>
            {profile.website && (
              <a href="#" className="text-blue-300 font-bold hover:underline block mt-2 text-sm">{profile.website}</a>
            )}
          </div>
        </div>
      </div>

      {/* Mobiel Stats & Bio */}
      <div className="md:hidden border-t border-zinc-900 pt-4 mb-6">
        <div className="font-bold text-sm mb-1">{profile.fullName}</div>
        <div className="text-sm text-zinc-300 mb-6 whitespace-pre-line leading-relaxed">{profile.bio}</div>
        <div className="flex justify-around border-t border-zinc-900 pt-4">
          <div className="flex flex-col items-center">
            <span className="font-bold text-[15px]">{posts.length}</span>
            <span className="text-zinc-500 text-xs">berichten</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[15px]">12.5k</span>
            <span className="text-zinc-500 text-xs">volgers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[15px]">842</span>
            <span className="text-zinc-500 text-xs">volgend</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-zinc-800 flex justify-center gap-12 mb-4">
        <button className={`flex items-center gap-2 py-4 border-t border-white text-white`}>
          <Grid size={14} />
          <span className="text-xs font-bold uppercase tracking-widest">Berichten</span>
        </button>
        <button className={`flex items-center gap-2 py-4 text-zinc-500`}>
          <Bookmark size={14} />
          <span className="text-xs font-bold uppercase tracking-widest">Opgeslagen</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-8 animate-in fade-in duration-700">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square bg-zinc-900 group cursor-pointer overflow-hidden">
            <img src={post.url} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
               <span className="font-bold text-white flex items-center gap-1">❤️ 32</span>
               <span className="font-bold text-white flex items-center gap-1">💬 8</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
