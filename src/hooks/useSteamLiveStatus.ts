import { useState, useEffect } from 'react';
import { GameRecommendation, SteamLiveGame, SteamLiveStatus } from '../types';
import { SteamLiveService } from '../services/SteamLiveService';

export const useSteamLiveStatus = (games: GameRecommendation[], category: string) => {
  const [status, setStatus] = useState<SteamLiveStatus>('loading');
  const [activeGame, setActiveGame] = useState<SteamLiveGame | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLive = async () => {
      if (!activeGame) setStatus('loading');

      try {
        // Tier 1: Try the blog category's games first
        const primaryLiveGames = await SteamLiveService.checkLiveStatusBatch(games);
        let bestGame = SteamLiveService.selectBestLiveGame(primaryLiveGames);

        // Tier 2: Fallback — other on-sale games in the SAME category
        if (!bestGame) {
          bestGame = await SteamLiveService.fetchCategoryFallbackLive(category);
        }

        // Tier 3: Fallback — ANY on-sale game sitewide
        if (!bestGame) {
          bestGame = await SteamLiveService.fetchSitewideFallbackLive();
        }

        if (isMounted) {
          if (bestGame) {
            setActiveGame(bestGame);
            setStatus('active');
          } else {
            // Tier 4: Show empty state
            setActiveGame(null);
            setStatus('empty');
          }
        }
      } catch (err) {
        console.error('Failed to fetch live status:', err);
        if (isMounted) setStatus('empty');
      }
    };

    fetchLive();

    const interval = setInterval(fetchLive, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [games, category]);

  return { status, activeGame };
};
