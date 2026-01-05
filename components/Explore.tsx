
import React from 'react';

export const Explore: React.FC = () => {
  const images = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/explore${i}/500/500`,
    isTall: i === 1 || i === 10
  }));

  return (
    <div className="p-4 pt-10">
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {images.map((img) => (
          <div 
            key={img.id} 
            className={`relative group cursor-pointer overflow-hidden aspect-square ${img.isTall ? 'row-span-2 aspect-auto' : ''}`}
          >
            <img 
              src={img.url} 
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-bold">❤️ {Math.floor(Math.random() * 900)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">💬 {Math.floor(Math.random() * 100)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
