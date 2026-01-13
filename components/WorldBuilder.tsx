
import React, { useState } from 'react';

const GRID_SIZE = 16;
const TILE_TYPES = [
  { id: 'empty', color: 'bg-transparent', label: '橡皮擦' },
  { id: 'wall', color: 'bg-slate-700', label: '墙壁' },
  { id: 'grass', color: 'bg-green-600', label: '草地' },
  { id: 'water', color: 'bg-blue-500', label: '水域' },
  { id: 'lava', color: 'bg-orange-600', label: '岩浆' },
  { id: 'goal', color: 'bg-yellow-400', label: '终点' },
];

interface WorldBuilderProps {
  grid: string[][];
  setGrid: React.Dispatch<React.SetStateAction<string[][]>>;
  selectedTile: string;
  setSelectedTile: React.Dispatch<React.SetStateAction<string>>;
}

const WorldBuilder: React.FC<WorldBuilderProps> = ({ grid, setGrid, selectedTile, setSelectedTile }) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleTileClick = (r: number, c: number) => {
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = selectedTile;
    setGrid(newGrid);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDrawing) {
      handleTileClick(r, c);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div 
          className="grid gap-[1px] bg-slate-700 border-4 border-slate-700 shadow-2xl"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
        >
          {grid.map((row, r) => (
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => handleTileClick(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                className={`w-5 h-5 md:w-8 md:h-8 transition-colors duration-100 cursor-crosshair ${
                  TILE_TYPES.find(t => t.id === cell)?.color || 'bg-slate-900'
                }`}
              />
            ))
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">点击并拖拽以绘制。16x16 关卡预览。</p>
      </div>

      <div className="w-full md:w-64 bg-slate-800/50 border border-slate-700 p-6 rounded-xl shrink-0">
        <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">图块调色板</h3>
        <div className="space-y-2">
          {TILE_TYPES.map((tile) => (
            <button
              key={tile.id}
              onClick={() => setSelectedTile(tile.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                selectedTile === tile.id 
                  ? 'bg-purple-600/20 border-purple-500 text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className={`w-4 h-4 rounded-sm ${tile.color} ${tile.id === 'empty' ? 'border border-slate-600' : ''}`}></div>
              <span className="text-xs font-bold">{tile.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <button 
            onClick={() => setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty')))}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-bold transition-colors"
          >
            清空画布
          </button>
          <button 
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold transition-colors shadow-lg"
            onClick={() => alert('地图数据已保存！')}
          >
            导出 JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorldBuilder;
