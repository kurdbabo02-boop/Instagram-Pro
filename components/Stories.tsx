
import React from 'react';
import { MOCK_STORIES, CURRENT_USER } from '../constants';

export const Stories: React.FC = () => {
  return (
    <div className="flex gap-4 overflow-x-auto py-3 px-4 no-scrollbar border-b border-zinc-900">
      {/* Current User Story - Matching Image 2 */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
        <div className="relative">
          <div className="w-[78px] h-[78px] rounded-full bg-zinc-800 flex items-center justify-center transition-transform group-hover:scale-95">
             <div className="w-[74px] h-[74px] bg-black rounded-full flex items-center justify-center p-[2px]">
                <img 
                  src={CURRENT_USER.avatar} 
                  alt="My Story" 
                  className="w-full h-full rounded-full object-cover grayscale-[0.3]" 
                />
             </div>
          </div>
          {/* Blue Plus Circle */}
          <div className="absolute bottom-0 right-0 bg-blue-500 border-[3px] border-black rounded-full w-6 h-6 flex items-center justify-center text-white shadow-lg">
             <div className="w-[10px] h-[2px] bg-white absolute"></div>
             <div className="w-[10px] h-[2px] bg-white rotate-90 absolute"></div>
          </div>
        </div>
        <span className="text-[11px] text-zinc-300 font-medium">Je verhaal</span>
      </div>

      {/* Other Stories */}
      {MOCK_STORIES.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
          <div className={`p-[2.5px] rounded-full ${story.hasUnseenStory ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 shadow-sm' : 'bg-zinc-800'}`}>
            <div className="bg-black p-[2px] rounded-full">
              <img 
                src={story.user.avatar} 
                alt={story.user.username} 
                className="w-[68px] h-[68px] rounded-full object-cover transition-transform group-hover:scale-95" 
              />
            </div>
          </div>
          <span className="text-[11px] text-zinc-300 truncate w-20 text-center font-medium">{story.user.username}</span>
        </div>
      ))}
    </div>
  );
};
