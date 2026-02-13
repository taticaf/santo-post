
import React from 'react';
import { GeneratedPost } from '../types';

interface ImageResultProps {
  post: GeneratedPost;
}

export const ImageResult: React.FC<ImageResultProps> = ({ post }) => {
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = post.imageUrl;
    link.download = `santopost-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100 flex flex-col">
      <div className="relative aspect-[3/4] bg-gray-100">
        <img 
          src={post.imageUrl} 
          alt="Arte Católica Gerada"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-orange-900">Resultado</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            <span className="font-semibold italic">"{post.bibleText}"</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadImage}
            className="flex-grow flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Baixar Imagem
          </button>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(post.imageUrl);
              alert('Link da imagem copiado!');
            }}
            className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            title="Copiar Link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
