
import React, { useState } from 'react';
import { Post } from './Post';
import { Stories } from './Stories';
import { INITIAL_POSTS } from '../constants';
import { PostData, AppView } from '../types';
import { Heart, Plus, ChevronDown } from 'lucide-react';

interface FeedProps {
  onViewChange: (view: AppView) => void;
}

export const Feed: React.FC<FeedProps> = ({ onViewChange }) => {
  const [posts] = useState<PostData[]>(INITIAL_POSTS);

  return (
    <div className="flex flex-col w-full bg-black min-h-screen">
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-black z-40 border-b border-zinc-900 md:border-none">
        <div className="flex items-center">
          <button onClick={() => onViewChange(AppView.CREATE)} className="hover:scale-110 transition-transform">
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="flex items-center gap-1 cursor-pointer group">
          <h1 className="text-xl font-bold tracking-tight">Voor jou</h1>
          <ChevronDown size={18} className="mt-0.5" />
        </div>

        <div className="flex items-center">
          <button onClick={() => onViewChange(AppView.NOTIFICATIONS)} className="hover:text-zinc-400 relative">
            <Heart size={28} strokeWidth={2.5} />
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-black"></div>
          </button>
        </div>
      </div>

      <div className="flex flex-col mx-auto w-full md:max-w-[470px]">
        <Stories />
        <div className="flex flex-col pt-1">
          {posts.map((post) => (
            <Post key={post.id} data={post} onShareClick={() => onViewChange(AppView.MESSAGES)} />
          ))}
        </div>
      </div>
    </div>
  );
};
