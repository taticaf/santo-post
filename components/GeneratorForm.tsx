
import React, { useState } from 'react';

interface GeneratorFormProps {
  onGenerate: (bibleText: string, phrase: string) => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [bibleText, setBibleText] = useState('');
  const [phrase, setPhrase] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bibleText.trim() && phrase.trim()) {
      onGenerate(bibleText, phrase);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Trecho Bíblico (Inspiração)
        </label>
        <textarea
          required
          value={bibleText}
          onChange={(e) => setBibleText(e.target.value)}
          placeholder="Ex: 'O Senhor é o meu pastor, nada me faltará' ou uma cena como 'A ressurreição de Cristo'."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[120px] transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Frase em Destaque
        </label>
        <input
          required
          type="text"
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="A frase que aparecerá escrita na imagem"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !bibleText.trim() || !phrase.trim()}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gerando Arte...
          </span>
        ) : 'Gerar Post'}
      </button>
    </form>
  );
};
