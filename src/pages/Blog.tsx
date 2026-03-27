import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { articles } from '../data/articles';
import { POPULAR_TAGS } from '../constants';
import { ThreadsCurationsCarousel } from '../components/ui/ThreadsCurationsCarousel';

/**
 * @component Blog
 * @description 遊戲網誌與社群推薦入口頁面。
 * 負責渲染動態擷取的 Threads 推薦文章，並提供精選導讀與電子報訂閱功能。
 */
export const Blog: React.FC = () => {

  const featuredArticles = articles.slice(0, 2); // Sim and Horror

  if (articles.length === 0) {
    return (
      <main className="max-w-screen-2xl mx-auto px-8 py-32 text-center text-on-surface">
        <Helmet>
          <title>目前沒有文章 | 四隻鳥遊戲推薦</title>
        </Helmet>
        <h2 className="text-2xl font-bold font-headline mb-4">目前沒有推薦文章</h2>
        <p className="text-on-surface-variant">請稍後再回來查看社群精選遊戲！</p>
      </main>
    );
  }

  return (
    <main className="max-w-screen-2xl mx-auto px-8 py-12 pt-24">
      <Helmet>
        <title>Steam遊戲推薦｜20+款多人必玩清單 | 四隻鳥遊戲推薦</title>
        <meta name="description" content="精選 Steam 2026 必玩多人遊戲推薦，包含雙人合作、派對遊戲與驚悚冒險。從 Threads 社群中挖掘最真實的玩家評價。" />
      </Helmet>
      {/* Editor's Picks / Bento Grid */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Trending Deep Dives</h2>
            <p className="text-on-surface-variant text-sm mt-1">Our most popular community curations this week.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.map((article) => (
            <Link key={article.id} to={`/${article.id}`} className="bg-surface-container rounded-xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300 block">
              <div className="h-48 overflow-hidden">
                <img alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={article.heroImage} />
              </div>
              <div className="p-8">
                <span className="text-primary text-[10px] font-bold tracking-widest uppercase mb-4 block">{article.category}</span>
                <h3 className="font-headline text-2xl font-bold mb-4 leading-snug">{article.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-2">{article.description}</p>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant border-t border-outline-variant/10 pt-6">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Threads Community Curations — Horizontal Carousel */}
      <ThreadsCurationsCarousel articles={articles} />
    </main>
  );
};
