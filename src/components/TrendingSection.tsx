import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SteamHoverTracker } from './SteamHoverTracker';

export const TrendingSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Approximates card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const trendingGames = [
    {
      id: 1,
      title: "Aether Legends",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQCSosGGv7qR7J3ub11YVkXXypSyczIGm0J7TaDngvu3fJfoLAet2faDkL7Z-udmpDcq94vO7glnkMWtYJF8LAnYK9szy4iLhqHR6ZwSm_sICTj5HhiBaunkQydEfOobUOuOl7l3C0t1_TGXxibFkX3aYGglDLmUEIxheJgBRQWDUZiUIgkJda1_6hAkj1IjwafIogqeUt5XNBc4KoRKjZZzdfH89ksMkZeBLs6QPtgyzP-_xMrCuDYSPMiPPHCgXVSY25GzfS3XHb",
      tags: ["RPG", "PvP"],
      rating: "4.8",
      highlight: "Great for a weekend session"
    },
    {
      id: 2,
      title: "Void Walker",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfY-HTy6GHNMG0pGUBRh49XtHhF1DzKREYQDmNgvXqLG9NYD6FhP6GzUS6Pf5NHQthkzMQY9s-8CeD6fPHvlrcTZ8FXeEFh53fJnqm4Wg5il6dUliWOupRoJ_f5NES0Hv567x6-4_SgQm2G3m5L83p-h9obtF9mrMkKbashS2PBUiRG2zQfm_7mIyWy87-AwbwdDlRVJblaTSAwukp-SO1JE87HyLUdmBBvh-jlWJUHl0p6YNZefKGtfNknAQYehWCMefQU9Y8T0Sl",
      tags: ["Souls-like", "Co-op"],
      rating: "4.6",
      highlight: "Hardcore Challenge"
    },
    {
      id: 3,
      title: "Silicon Dreams",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBynheZ-MNLsz7AmV7NhnJvGZTtHUb4xgfQ3jAEEkkvpoj3eoYhttB2st7_2G0jkeYaAD4rRQ-DXjw2AW1CNX8RT5yTDDWG4sCHtUSIV1GSZwEHO-_SNPt_XtJTvVsnEjVFsVBw8-nJ79H2o3WNierlpI5gK-w2cgllIP0fcze2q8TnfTiDyIuAJkvynIJ6ttaveLTr7lZ700cW7O0XPi0hosl4E07vtOPPfh0DZL8YphQRliegAx1rAd9FlA2UU_eVCqxkg2YgW3nA",
      tags: ["Simulation", "Indie"],
      rating: "4.9",
      highlight: "Endless Replayability"
    },
    {
      id: 4,
      title: "Lunar Path",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDq2IkMtNCb8qP6Pf5rdaz_srofAwgGYEKgD5XwvzXKQWKRYxGZrO8l6LK2oXt8FzYC0_zMiIoe__sXaSeUBUE--Uxzte75-DIiQV9GObhu3UXEZag6kwtw0jqUQbRU4W4XU0Wdf5Bj9Nnx44sG7BfT3aexXyMvIi9lR91kz_2DmK8_TICsy1ZFH9raoRgiF2_SM2vbCsm-MDNSTauQjQMgmCwMCtS77fdehp6s0uk2MZQ-rpoXGSypzOxtlqFBb6g52p8NN_3-EWpE",
      tags: ["Adventure", "Story"],
      rating: "4.5",
      highlight: "Atmospheric Masterpiece"
    }
  ];

  return (
    <section className="py-12 px-8 md:px-16 lg:px-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Trending Multiplayer</h2>
          <p className="text-on-surface-variant text-sm mt-1">What the community is playing right now.</p>
        </div>
        <Link to="/browse" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
          Explore All <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
        </Link>
        <div className="flex gap-2 ml-4">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors text-on-surface"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x">
        {trendingGames.map((game) => (
          <Link to={`/game/${game.id}`} key={game.id} className="min-w-[280px] md:min-w-[320px] group cursor-pointer block">
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-container relative">
              <div className="absolute inset-0 w-full h-full">
                <SteamHoverTracker appId={game.id} title={game.title} imageUrl={game.image} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 pointer-events-none">
                <span className="text-primary text-xs font-bold">{game.highlight}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-on-surface font-headline">{game.title}</h3>
                <div className="flex gap-2 mt-1">
                  {game.tags.map(tag => (
                    <span key={tag} className="text-[10px] text-on-surface-variant px-2 py-0.5 bg-surface-container-high rounded uppercase font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center text-primary">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-xs font-bold ml-1">{game.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
