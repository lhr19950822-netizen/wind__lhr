
import React from 'react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: TabType.BRAINSTORM, label: '设计对话', icon: '💡' },
    { id: TabType.SPRITE_GEN, label: '素材熔炉', icon: '🎨' },
    { id: TabType.DESTINY_WEAVER, label: '命运编织', icon: '🃏' },
    { id: TabType.SETTINGS, label: '系统设置', icon: '⚙️' },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center font-bold text-white pixel-font text-2xl shadow-[0_0_15px_rgba(147,51,234,0.3)]">P</div>
        <h1 className="hidden md:block text-xl font-bold tracking-tighter text-purple-400 pixel-font">PIXEL FORGE</h1>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]' 
                : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:block font-medium text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-900 hidden md:block">
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          <p className="text-[10px] text-slate-600 uppercase font-black mb-1">Engine Status</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[10px] text-slate-400 font-bold">GEMINI 3 PRO ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
