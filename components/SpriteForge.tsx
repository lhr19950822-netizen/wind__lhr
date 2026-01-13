
import React, { useState } from 'react';
import { generatePixelSprite } from '../services/geminiService';
import { SpriteAsset } from '../types';

interface SpriteForgeProps {
  assets: SpriteAsset[];
  setAssets: React.Dispatch<React.SetStateAction<SpriteAsset[]>>;
}

const ITEMS_PER_PAGE = 8;

const SpriteForge: React.FC<SpriteForgeProps> = ({ assets, setAssets }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(assets.length / ITEMS_PER_PAGE);
  const displayedAssets = assets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const imageUrl = await generatePixelSprite(prompt);
      if (imageUrl) {
        const newAsset: SpriteAsset = {
          id: Math.random().toString(36).substr(2, 9),
          name: prompt,
          url: imageUrl,
          description: prompt,
          timestamp: Date.now()
        };
        setAssets(prev => [newAsset, ...prev]);
        setCurrentPage(1); // 跳转回第一页查看新生成的
      }
    } catch (error) {
      console.error("Sprite generation failed", error);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl shrink-0">
        <h2 className="text-xl font-bold mb-4 pixel-font text-purple-400">像素素材熔炉 (Sprite Forge)</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="描述你想要的像素素材..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition-all shadow-[0_4px_0_rgb(88,28,135)] active:translate-y-1 active:shadow-none"
          >
            {isGenerating ? '正在炼制...' : '开始生成'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-1">
          {isGenerating && (
            <div className="aspect-square bg-slate-800/50 rounded-xl border-2 border-dashed border-purple-500/50 flex flex-col items-center justify-center animate-pulse">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">像素化中...</p>
            </div>
          )}

          {displayedAssets.map((asset) => (
            <div key={asset.id} className="group flex flex-col bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all shadow-lg">
              <div className="aspect-square bg-slate-900 p-6 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={asset.url} 
                  alt={asset.name} 
                  className="w-full h-full object-contain image-pixelated transition-transform group-hover:scale-125"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-3 bg-slate-800 border-t border-slate-700 mt-auto">
                <p className="text-[10px] font-black text-slate-300 truncate uppercase mb-2">{asset.name}</p>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = asset.url;
                    link.download = `${asset.name.replace(/\s+/g, '_')}.png`;
                    link.click();
                  }}
                  className="w-full py-1.5 bg-slate-700 hover:bg-purple-600 text-white text-[10px] font-bold rounded transition-colors uppercase"
                >
                  📥 下载素材
                </button>
              </div>
            </div>
          ))}

          {assets.length === 0 && !isGenerating && (
            <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl text-slate-500">
              <span className="text-4xl mb-4">🔮</span>
              <p className="pixel-font text-lg text-slate-400 uppercase tracking-widest">暂无素材，请先在熔炉中炼制</p>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4 border-t border-slate-800 shrink-0">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30"
          >
            ◀ PREV
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition-all ${
                  currentPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30"
          >
            NEXT ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default SpriteForge;
