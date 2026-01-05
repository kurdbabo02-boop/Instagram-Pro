
import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music } from 'lucide-react';
import { PostData } from '../types';

interface PostProps {
  data: PostData;
  onShareClick?: () => void;
}

export const Post: React.FC<PostProps> = ({ data, onShareClick }) => {
  const [isLiked, setIsLiked] = useState(data.isLiked || false);
  const [likes, setLikes] = useState(data.likes);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes(prev => prev + 1);
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);
  };

  return (
    <div className="bg-black mb-6 w-full animate-in fade-in duration-500">
      {/* Header - Matching Image 2 */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-[2px] rounded-full ${Math.random() > 0.3 ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-zinc-800'}`}>
            <div className="bg-black p-[2px] rounded-full">
              <img src={data.user.avatar} className="w-8 h-8 rounded-full object-cover shadow-inner" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold hover:text-zinc-400 cursor-pointer">{data.user.username}</span>
              {data.user.isVerified && (
                <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-black shadow-sm">
                  ✓
                </div>
              )}
            </div>
            {/* Music Info - Visible in Screenshot 2 */}
            <div className="flex items-center gap-1.5 text-[11px] text-white/90 cursor-pointer hover:underline group">
               <Music size={10} strokeWidth={3} className="group-hover:animate-pulse" />
               <span className="font-medium truncate max-w-[200px]">Dean Martin • Let It Snow! Let It Snow! Let It Snow!</span>
            </div>
          </div>
        </div>
        <button className="hover:text-zinc-500 transition-colors p-1">
          <MoreHorizontal size={22} />
        </button>
      </div>

      {/* Image Container */}
      <div 
        className="relative aspect-square w-full bg-zinc-950 group cursor-pointer overflow-hidden"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={data.imageUrl} 
          alt="Post content" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {showHeartOverlay && (
          <div className="absolute inset-0 flex items-center justify-center animate-heart-pop pointer-events-none">
            <Heart size={100} fill="white" className="text-white drop-shadow-2xl" />
          </div>
        )}

        {/* Volume icon placeholder (Screenshot 2 bottom right) */}
        <div className="absolute bottom-3 right-3 bg-black/50 p-1.5 rounded-full">
           <Music size={14} className="text-white" />
        </div>
      </div>

      {/* Actions */}
      <div className="px-3.5 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="active:scale-90 transition-transform">
              <Heart 
                size={28} 
                className={isLiked ? "text-red-500 fill-red-500" : "text-white"} 
                strokeWidth={isLiked ? 0 : 2.5}
              />
            </button>
            <button className="active:scale-90 transition-transform hover:text-zinc-400">
              <MessageCircle size={28} strokeWidth={2.5} />
            </button>
            <button 
              onClick={onShareClick}
              className="active:scale-90 transition-transform hover:text-zinc-400"
            >
              <Send size={28} strokeWidth={2.5} />
            </button>
          </div>
          <button className="active:scale-90 transition-transform hover:text-zinc-400">
            <Bookmark size={28} strokeWidth={2.5} />
          </button>
        </div>

        {/* Likes */}
        <div className="font-bold text-[13px] mb-1 px-0.5">
          {likes.toLocaleString()} vind-ik-leuks
        </div>

        {/* Caption */}
        <div className="text-[13px] mb-1 px-0.5 leading-[18px]">
          <span className="font-bold mr-1.5 hover:underline cursor-pointer">{data.user.username}</span>
          <span className="text-zinc-100">{data.caption}</span>
        </div>

        {/* Comment Prompt */}
        <button className="text-zinc-500 text-[13px] mb-2 px-0.5 hover:text-zinc-400">
          Alle {data.commentsCount} reacties bekijken
        </button>

        <div className="text-[10px] text-zinc-500 uppercase font-medium px-0.5 mt-0.5">
          {data.timestamp} geleden
        </div>
      </div>
    </div>
  );
};
