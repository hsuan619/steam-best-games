import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';
import { POPULAR_TAGS } from '../constants';

/**
 * @component Blog
 * @description 遊戲網誌與社群推薦入口頁面。
 * 負責渲染動態擷取的 Threads 推薦文章，並提供精選導讀與電子報訂閱功能。
 */
export const Blog: React.FC = () => {

  const heroArticle = articles[1]; // Action & Puzzle
  const featuredArticles = [articles[2], articles[3]]; // Sim and Horror
  const listArticles = articles;

  const [visibleCount, setVisibleCount] = useState(5);
  const visibleArticles = listArticles.slice(0, visibleCount);
  const hasMore = visibleCount < listArticles.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  return (
    <main className="max-w-screen-2xl mx-auto px-8 py-12 pt-24">
      {/* Featured Hero Section */}
      <section className="mb-20">
        <div className="bg-surface-container-low rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-primary/5 border border-outline-variant/10">
          <div className="lg:w-1/2 p-12 md:p-16 lg:p-20 flex flex-col justify-center bg-gradient-to-br from-surface-container-low to-surface-container">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-primary font-bold text-[10px] uppercase tracking-widest">{heroArticle.category}</span>
              <span className="text-on-surface-variant text-[10px]">{heroArticle.date}</span>
            </div>
            <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-6 leading-[1.1]">{heroArticle.title}</h1>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-8 max-w-2xl">{heroArticle.description}</p>
            <Link to={`/blog/${heroArticle.id}`} className="primary-gradient text-on-primary px-8 py-3 rounded-md font-bold text-sm tracking-tight transition-transform active:scale-95 flex items-center gap-2 group/btn w-max">
              Read Full Story
              <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-x-1" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
            </Link>
          </div>
          <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-[500px]">
            <img alt="Featured article hero" className="absolute inset-0 w-full h-full object-cover" src={heroArticle.heroImage} />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low to-transparent w-32 hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Editor's Picks / Bento Grid */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Trending Deep Dives</h2>
            <p className="text-on-surface-variant text-sm mt-1">Our most popular community curations this week.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.map((article, index) => (
            <Link key={article.id} to={`/blog/${article.id}`} className="bg-surface-container rounded-xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300 block">
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
        {/* Main Feed */}
        <section className="xl:col-span-8">
          <h2 className="font-headline text-2xl font-bold mb-8 border-l-4 border-primary pl-4">All Threads Community Curations</h2>
          <div className="space-y-10">
            {visibleArticles.map((article) => (
              <Link key={`list-${article.id}`} to={`/blog/${article.id}`} className="group cursor-pointer block">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-56 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest">
                    <img alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={article.heroImage} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-primary font-bold text-[10px] uppercase tracking-widest">{article.category}</span>
                      <span className="text-on-surface-variant text-[10px]">{article.date}</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">{article.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {hasMore && (
            <button 
              onClick={handleLoadMore}
              className="w-full mt-12 py-4 border border-outline-variant/30 rounded-lg text-sm font-bold text-on-surface hover:bg-surface-container transition-colors active:scale-95"
            >
              Load More Articles
            </button>
          )}
        </section>
      </div>
    </main>
  );
};
