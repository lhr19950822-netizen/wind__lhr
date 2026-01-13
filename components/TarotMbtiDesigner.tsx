
import React, { useState } from 'react';
import { generateTarotMbtiConcept } from '../services/geminiService';

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const TAROT_CARDS = [
  '愚者', '魔术师', '女教皇', '女皇', '皇帝', '教皇', '恋人', '战车', 
  '力量', '隐士', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔', 
  '高塔', '星星', '月亮', '太阳', '审判', '世界'
];

const TarotMbtiDesigner: React.FC = () => {
  const [selectedMbti, setSelectedMbti] = useState('INTJ');
  const [currentTarot, setCurrentTarot] = useState<string | null>(null);
  const [concept, setConcept] = useState<string>('');
  const [isWeaving, setIsWeaving] = useState(false);

  const handleDrawTarot = () => {
    const randomCard = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
    setCurrentTarot(randomCard);
    setConcept('');
  };

  const handleWeaveDestiny = async () => {
    if (!currentTarot || isWeaving) return;
    setIsWeaving(true);
    try {
      const result = await generateTarotMbtiConcept(selectedMbti, currentTarot);
      setConcept(result);
    } catch (error) {
      console.error(error);
      setConcept('命运之线已断裂...请稍后再试。');
    } finally {
      setIsWeaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 overflow-hidden">
      {/* Selection Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 overflow-y-auto pr-2">
        <section>
          <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3">1. 选择性格矩阵 (MBTI)</h3>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedMbti(type)}
                className={`py-2 text-[10px] font-bold rounded border transition-all ${
                  selectedMbti === type 
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center">
          <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-4">2. 抽取命运卡牌 (TAROT)</h3>
          <div className={`w-32 h-48 rounded-lg border-2 mb-4 flex flex-center items-center justify-center transition-all ${
            currentTarot ? 'bg-slate-900 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-slate-800 border-dashed border-slate-600'
          }`}>
            {currentTarot ? (
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">🃏</span>
                <span className="pixel-font text-lg text-yellow-500">{currentTarot}</span>
              </div>
            ) : (
              <span className="text-slate-600 text-[10px] font-bold">待抽取</span>
            )}
          </div>
          <button
            onClick={handleDrawTarot}
            className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-black rounded text-[10px] uppercase shadow-[0_4px_0_rgb(161,98,7)] transition-all active:translate-y-1 active:shadow-none"
          >
            🔮 抽取塔罗
          </button>
        </section>

        <button
          onClick={handleWeaveDestiny}
          disabled={!currentTarot || isWeaving}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-xl text-xs uppercase shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {isWeaving ? '正在编织命运...' : '✨ 开始神启合成'}
        </button>
      </div>

      {/* Result Panel */}
      <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-2xl p-6 overflow-y-auto relative">
        {!concept && !isWeaving && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
            <span className="text-6xl mb-4 opacity-20">🪐</span>
            <p className="pixel-font text-xl uppercase tracking-[0.2em]">请在左侧选择你的契约组合</p>
          </div>
        )}

        {isWeaving && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="pixel-font text-purple-400 animate-pulse">正在从阿卡夏记录中提取设计灵感...</p>
          </div>
        )}

        {concept && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-purple-500 text-black text-[10px] font-black rounded">{selectedMbti}</span>
              <span className="text-slate-500">×</span>
              <span className="px-3 py-1 bg-yellow-500 text-black text-[10px] font-black rounded">{currentTarot}</span>
            </div>
            <div className="prose prose-invert max-w-none text-slate-300">
              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: concept.replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarotMbtiDesigner;
