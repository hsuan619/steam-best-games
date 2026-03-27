import React from 'react';
import { Article } from '../../types';
import { ThreadsCurationsCard } from './ThreadsCurationsCard';
import { useCarouselScroll } from '../../hooks/useCarouselScroll';

interface Props {
  articles: Article[];
}

/**
 * @component ThreadsCurationsCarousel
 * @description 橫向可滾動的主題文章展示櫥窗，支援拖曳、按鈕切換、兩側漸層遮罩。
 * 消費 src/data/articles.ts 資料，文章數量自動延展，無需手動調整版面。
 */
export const ThreadsCurationsCarousel: React.FC<Props> = ({ articles }) => {
  const { scrollRef, scrollState, updateScrollState, scrollBy, onMouseDown } = useCarouselScroll();

  if (articles.length === 0) return null;

  return (
    <section className="mb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline text-2xl font-bold border-l-4 border-primary pl-4 text-on-surface">
          All Threads Community Curations
        </h2>

        {/* Nav buttons */}
        <div className="flex gap-2">
          <button
            aria-label="向左滾動"
            disabled={!scrollState.canScrollLeft}
            onClick={() => scrollBy('left')}
            className="w-9 h-9 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            aria-label="向右滾動"
            disabled={!scrollState.canScrollRight}
            onClick={() => scrollBy('right')}
            className="w-9 h-9 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Carousel wrapper with gradient masks */}
      <div className="relative">
        {/* Left gradient mask */}
        {scrollState.canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surface to-transparent z-10" />
        )}

        {/* Right gradient mask */}
        {scrollState.canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface to-transparent z-10" />
        )}

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          onMouseDown={onMouseDown}
          className="flex gap-5 overflow-x-auto pb-3 scroll-smooth no-scrollbar"
          style={{ cursor: 'grab' }}
        >
          {articles.map((article) => (
            <ThreadsCurationsCard key={article.id} article={article} />
          ))}
        </div>
      </div>

      {/* Article count indicator */}
      <p className="text-xs text-on-surface-variant/50 mt-3 text-right">
        {articles.length} 個主題精選 · 左右滑動查看更多
      </p>
    </section>
  );
};
