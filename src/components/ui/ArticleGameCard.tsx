import React from 'react';
import { GameRecommendation } from '../../types';
import { SteamHoverTracker } from '../SteamHoverTracker';

/**
 * `<ArticleGameCardProps>` 介面定義
 * @property {GameRecommendation} game - 遊戲的推薦資料實體
 * @property {number} index - 該款遊戲在推薦列表中的順位編號
 */
interface ArticleGameCardProps {
  game: GameRecommendation;
  index: number;
}

/**
 * @component ArticleGameCard
 * @description 負責在 Blogger 推薦文章詳細頁面中，渲染單一推薦遊戲的卡片。
 * 將繁雜的卡片結構 (包含標題、簡介、Threads 留言、圖片、Steam 連結鈕) 從主頁面中抽離，實現單一職責與容易重複使用。
 * 支援透過傳入 index 自動排版順位，並套用玻璃擬態與懸停動畫。
 * 
 * @param {ArticleGameCardProps} props - 元件的各項屬性
 * @returns {JSX.Element} 經過優化與重構的推薦遊戲渲染區塊
 */
export const ArticleGameCard: React.FC<ArticleGameCardProps> = ({ game, index }) => {
  return (
    <div id={`game-${game.id}`} className="bg-surface-container-low border-l-4 border-primary p-6 rounded-r-xl my-10 shadow-lg shadow-black/20 scroll-mt-24">
      <h3 className="font-headline text-3xl font-bold text-on-surface mb-3 flex items-center gap-3">
        <span className="text-primary">{index + 1}.</span> {game.title}
      </h3>
      
      {/* 2. Brief Description */}
      <p className="mb-6 text-sm text-on-surface-variant/90 leading-relaxed font-medium">
        {game.description}
      </p>
      
      {/* 3. Threads 相關留言 */}
      <div className="relative mb-8 border-l-2 border-primary/50 pl-5 py-3 bg-surface-container-lowest/50 rounded-r-lg italic text-on-surface-variant shadow-inner">
        <span className="material-symbols-outlined absolute -left-4 -top-3 text-primary bg-surface-container-low rounded-full scale-75 border-4 border-surface-container-low">format_quote</span>
        <p className="text-sm">"{game.threadsComment}"</p>
        <div className="text-[10px] uppercase font-bold text-primary mt-2 tracking-widest">— Threads 推文節錄</div>
      </div>

      {/* 4. 相關影片/圖片 (Hover 自動觸發 Steam 追蹤面板) */}
      <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/20 shadow-xl group flex flex-col">
        <SteamHoverTracker 
          appId={game.steamAppId || game.id} 
          imageUrl={game.imageUrl} 
          title={game.title} 
        />
        
        {/* 5. Steam 連結 */}
        <div className="p-5 flex justify-between items-center bg-surface-container-high/30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface text-3xl">sports_esports</span>
            <div>
              <h4 className="font-bold text-on-surface leading-tight text-lg">{game.title}</h4>
              <p className="text-xs text-on-surface-variant/80 mt-0.5">Steam 官方頁面</p>
            </div>
          </div>
          <a href={game.steamUrl} target="_blank" rel="noopener noreferrer" className="bg-primary/20 text-primary font-bold px-6 py-2.5 rounded-lg hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 flex items-center gap-2">
            前往 Steam <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
};
