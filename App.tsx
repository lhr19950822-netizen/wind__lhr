
import React, { useState, useEffect } from 'react';
import { TabType, ChatMessage, SpriteAsset } from './types';
import Sidebar from './components/Sidebar';
import BrainstormPanel from './components/BrainstormPanel';
import SpriteForge from './components/SpriteForge';
import TarotMbtiDesigner from './components/TarotMbtiDesigner';

const STORAGE_KEYS = {
  MESSAGES: 'pixelforge_messages',
  ASSETS: 'pixelforge_assets'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.BRAINSTORM);

  // 1. Brainstorm State with persistence
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
    return [{ role: 'ai', content: "欢迎回来，创意官。我们的像素冒险继续进行。我们可以从构思世界观开始，也可以直接去“命运编织”抽取你的新英雄原型。" }];
  });

  // 2. Sprite Forge State with persistence
  const [assets, setAssets] = useState<SpriteAsset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved assets", e);
      }
    }
    return [];
  });

  // Effect to save messages when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Effect to save assets when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);

  const renderContent = () => {
    switch (activeTab) {
      case TabType.BRAINSTORM:
        return <BrainstormPanel messages={messages} setMessages={setMessages} />;
      case TabType.SPRITE_GEN:
        return <SpriteForge assets={assets} setAssets={setAssets} />;
      case TabType.DESTINY_WEAVER:
        return <TarotMbtiDesigner />;
      case TabType.SETTINGS:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-800/10 rounded-2xl border border-slate-800 border-dashed">
            <h2 className="text-2xl font-bold pixel-font text-slate-200 mb-2">开发者设置</h2>
            <p className="text-sm mb-8 opacity-60">PIXELFORGE CORE v1.2.1-PERSISTENCE</p>
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">数据持久化</span>
                  <span className="text-[9px] text-green-500 font-bold uppercase">Local Storage: Active</span>
                </div>
                <button 
                  onClick={() => {
                    if(confirm('确定要清除所有本地资产和对话记录吗？这将重置你的整个工作区。')) {
                      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
                      localStorage.removeItem(STORAGE_KEYS.ASSETS);
                      setMessages([{ role: 'ai', content: "系统已重置。我是你的 AI 创意官，让我们重新开始吧。" }]);
                      setAssets([]);
                      alert('记忆已清除。');
                    }
                  }}
                  className="px-4 py-2 bg-red-950/30 border border-red-900/50 text-red-400 text-[10px] font-black hover:bg-red-900/40 rounded transition-all"
                >
                  FACTORY_RESET
                </button>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center opacity-50">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">云端同步</span>
                <span className="text-[10px] font-bold text-slate-700 italic">COMING SOON</span>
              </div>
            </div>
          </div>
        );
      default:
        return <BrainstormPanel messages={messages} setMessages={setMessages} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden crt bg-slate-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden relative">
        {/* Decorative Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        
        <header className="mb-6 flex justify-between items-end shrink-0">
          <div>
            <h2 className="text-slate-600 text-[10px] uppercase font-black tracking-[0.3em] mb-1">Alchemist Workspace</h2>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white pixel-font tracking-tight">
                {activeTab.replace('_', ' ')}
              </h1>
              <div className="h-4 w-px bg-slate-800 mx-1"></div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/40 text-purple-400 font-bold border border-purple-800/50">AUTO_SAVE: ON</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase border border-slate-800 transition-all"
              onClick={() => alert('所有进度已自动保存至浏览器缓存。')}
            >
              Manual_Backup
            </button>
            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-lg">
              ✨
            </div>
          </div>
        </header>

        <section className="flex-1 min-h-0">
          {renderContent()}
        </section>

        <footer className="mt-4 flex justify-between items-center text-[9px] text-slate-600 font-bold uppercase tracking-widest shrink-0">
          <div className="flex gap-6">
            <span>© 2024 PixelForge Alchemist</span>
            <span className="text-purple-900/50">|</span>
            <span>Data Persistence Enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
            <span>Memory_System: Secure</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
