import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameRecommendation } from '../types';
import { useSteamLiveStatus } from '../hooks/useSteamLiveStatus';

interface Props {
  games: GameRecommendation[];
  category: string;
}

export const SteamLiveFloatingWidget: React.FC<Props> = ({ games, category }) => {
  const { status, activeGame } = useSteamLiveStatus(games, category);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {(status === 'active' || status === 'empty') && (
        <motion.div
          key="widget-container"
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 w-72 bg-[#171a21]/95 backdrop-blur-md rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[#2a475e] overflow-hidden flex flex-col"
        >
          {/* Header bar — Clickable to Toggle Collapse */}
          <div
            className="bg-gradient-to-r from-[#1b2838] to-[#2a475e] px-3 py-2 flex justify-between items-center border-b border-white/5 cursor-pointer hover:bg-[#2a475e] transition-colors"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <div className="flex items-center gap-2">
              {status === 'active' ? (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              ) : (
                <span className="material-symbols-outlined text-white/50 text-[14px]">videocam_off</span>
              )}
              <span className="text-white text-xs font-bold tracking-wider">
                {status === 'active' ? 'LIVE BROADCAST' : 'STEAM LIVE'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {status === 'active' && activeGame && !isCollapsed && (
                <div className="flex items-center gap-1 text-[#66c0f4]">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span className="text-[10px] font-bold">{activeGame.viewers.toLocaleString()}</span>
                </div>
              )}
              <span className="material-symbols-outlined text-white/40 hover:text-white transition-colors text-[20px]">
                {isCollapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                key="widget-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {status === 'active' && activeGame ? (
                  <div
                    className="cursor-pointer group"
                    onClick={() => window.open(activeGame.gameUrl, '_blank')}
                  >
                    {/* Preview image */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={activeGame.previewImageUrl}
                        alt={activeGame.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                        <span className="material-symbols-outlined text-white/80 text-4xl group-hover:scale-110 transition-transform">play_circle</span>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
                        {activeGame.streamerName}
                      </div>
                    </div>

                    {/* Game info */}
                    <div className="p-3 bg-[#171a21]">
                      <h4 className="text-white font-bold text-sm truncate group-hover:text-[#66c0f4] transition-colors">{activeGame.title}</h4>
                      <div className="flex items-center gap-1 mt-1 text-[#66c0f4]/80">
                        <span className="material-symbols-outlined text-[12px]">thumb_up</span>
                        <span className="text-[10px]">Steam 評價 ({activeGame.recommendations.toLocaleString()})</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center text-center bg-[#171a21]/50">
                    <span className="material-symbols-outlined text-white/30 text-4xl mb-2">videocam_off</span>
                    <h4 className="text-white/70 font-bold text-sm">目前尚無促銷遊戲直播</h4>
                    <p className="text-white/40 text-[10px] mt-1">稍後為您重新整理</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};