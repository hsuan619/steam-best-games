import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';

interface Props {
  article: Article;
}

/**
 * @component ThreadsCurationsCard
 * @description 單一主題文章卡片，橫向排列於 ThreadsCurationsCarousel 中。
 * 顯示封面圖、類別標籤、標題、描述、日期，並支援 hover 動畫。
 */
export const ThreadsCurationsCard: React.FC<Props> = ({ article }) => {
  return (
    <Link
      to={`/blog/${article.id}`}
      className="group flex-shrink-0 w-72 bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Cover image */}
      <div className="h-40 overflow-hidden bg-surface-container-highest">
        <img
          alt={article.title}
          src={article.heroImage}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-[10px] uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-on-surface-variant/60 text-[10px]">·</span>
          <span className="text-on-surface-variant text-[10px]">{article.date}</span>
        </div>

        <h3 className="font-headline font-bold text-base leading-snug text-on-surface group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2 mt-1">
          {article.description}
        </p>

        <div className="flex items-center gap-1 mt-2 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Read more</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </div>
      </div>
    </Link>
  );
};
