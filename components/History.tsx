
import React from 'react';
import { GeneratedPost } from '../types';

interface HistoryProps {
  posts: GeneratedPost[];
  onSelect: (post: GeneratedPost) => void;
}

export const History: React.FC<HistoryProps> = ({ posts, onSelect }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-orange-900 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Suas Criações
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => onSelect(post)}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 hover:ring-4 hover:ring-orange-300 transition-all text-left"
          >
            <img 
              src={post.imageUrl} 
              alt={post.phrase}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
              <p className="text-white text-xs font-semibold line-clamp-2">{post.phrase}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
