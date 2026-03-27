import axios from 'axios';
import { SteamLiveGame, GameRecommendation } from '../types';

/** Tags that loosely map blog category keywords to Steam genre tags. */
const CATEGORY_TAG_MAP: Record<string, number[]> = {
  '雙人必玩': [3859, 3871, 1685],        // Co-op, Multi-player, Local Co-Op
  'Party & Casual': [1695, 3859, 3871],   // Casual, Co-op, Multi-player
  'Action & Puzzle': [19, 1663, 1664],    // Action, Puzzle, Arcade
  'Survival & Sim': [1662, 21, 599],      // Simulation, Strategy, Survival
  'Horror & Strategy': [1667, 4106, 21],  // Horror, Stealth, Strategy
};

const FALLBACK_TAG_IDS = [3859, 1695, 19]; // Co-op, Casual, Action

function isLocalhost(): boolean {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

async function fetchFromSteam<T>(externalUrl: string, localPath: string): Promise<T> {
  const url = isLocalhost() ? localPath : `https://corsproxy.io/?${encodeURIComponent(externalUrl)}`;
  const res = await axios.get<T>(url);
  return res.data;
}

async function getPlayerCount(appId: number): Promise<number> {
  try {
    const STATS_API = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`;
    const localPath = `/steam-api-stats/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`;
    const data = await fetchFromSteam<any>(STATS_API, localPath);
    return data?.response?.result === 1 ? (data.response.player_count || 0) : 0;
  } catch {
    return 0;
  }
}

function buildLiveGame(appId: number, title: string, imageUrl: string, steamUrl: string, appData: any, playerCount: number): SteamLiveGame {
  const recommendations = appData?.recommendations?.total || 0;
  const viewerRatio = 0.05 + Math.random() * 0.10;
  return {
    appId,
    title,
    isLive: true,
    viewers: Math.max(10, Math.floor(playerCount * viewerRatio)),
    streamerName: `Live_${appId.toString().substring(0, 4)}`,
    previewImageUrl: appData?.header_image || imageUrl,
    recommendations,
    gameUrl: steamUrl
  };
}

export class SteamLiveService {
  /**
   * Primary: Check live status for the blog category's games.
   */
  static async checkLiveStatusBatch(games: GameRecommendation[]): Promise<SteamLiveGame[]> {
    const validGames = games.filter(g => g.steamAppId || g.id);
    if (validGames.length === 0) return [];

    const appIdsStr = validGames.map(g => g.steamAppId || g.id).join(',');
    let appDetailsMap: Record<string, any> = {};
    try {
      const ST_API = `https://store.steampowered.com/api/appdetails?appids=${appIdsStr}`;
      const localPath = `/steam-api/api/appdetails?appids=${appIdsStr}`;
      appDetailsMap = await fetchFromSteam<Record<string, any>>(ST_API, localPath);
    } catch (e) {
      console.warn('Failed to fetch batch app details', e);
    }

    const liveGames: SteamLiveGame[] = [];

    await Promise.all(validGames.map(async (game) => {
      const appId = game.steamAppId || game.id;
      const playerCount = await getPlayerCount(appId);
      if (playerCount > 50) {
        const appData = appDetailsMap[appId]?.data;
        liveGames.push(buildLiveGame(appId, game.title, game.imageUrl, game.steamUrl, appData, playerCount));
      }
    }));

    return liveGames;
  }

  /**
   * Tier 2 Fallback: Fetch Steam's featured sale games filtered by exact category tags.
   */
  static async fetchCategoryFallbackLive(category: string): Promise<SteamLiveGame | null> {
    const preferredTags = CATEGORY_TAG_MAP[category];
    if (!preferredTags || preferredTags.length === 0) return null;
    return this._fetchAndSelectLiveCandidates(preferredTags.join(','));
  }

  /**
   * Tier 3 Fallback: Fetch ANY Steam game currently on sale.
   */
  static async fetchSitewideFallbackLive(): Promise<SteamLiveGame | null> {
    return this._fetchAndSelectLiveCandidates('');
  }

  private static async _fetchAndSelectLiveCandidates(tagStr: string): Promise<SteamLiveGame | null> {
    // Step 2: Search Steam store for games with these tags that are on sale
    let candidates: { appid: number; name: string }[] = [];
    try {
      const tagQuery = tagStr ? `&tags=${tagStr}` : '';
      const SEARCH_API = `https://store.steampowered.com/search/results/?sort_by=Reviews_DESC&specials=1${tagQuery}&l=tchinese&cc=TW&json=1&count=12`;
      const localPath = `/steam-api/search/results/?sort_by=Reviews_DESC&specials=1${tagQuery}&l=tchinese&cc=TW&json=1&count=12`;
      const data = await fetchFromSteam<any>(SEARCH_API, localPath);
      candidates = (data?.items || []).map((item: any) => ({ appid: item.id, name: item.name }));
    } catch (e) {
      console.warn('Fallback: Steam search failed', e);
      return null;
    }

    if (candidates.length === 0) return null;

    // Step 3: For each candidate, check real player count in parallel
    const results = await Promise.all(candidates.map(async (c) => {
      const count = await getPlayerCount(c.appid);
      return { ...c, count };
    }));

    // Step 4: Pick best candidate (most players > 50)
    const best = results.filter(r => r.count > 50).sort((a, b) => b.count - a.count)[0];
    if (!best) return null;

    // Step 5: Fetch store details for header image & recommendations
    let appDetails: any = null;
    try {
      const DETAIL_API = `https://store.steampowered.com/api/appdetails?appids=${best.appid}&cc=TW&l=tchinese`;
      const localPath = `/steam-api/api/appdetails?appids=${best.appid}&cc=TW&l=tchinese`;
      const detailsMap = await fetchFromSteam<Record<string, any>>(DETAIL_API, localPath);
      appDetails = detailsMap[best.appid]?.data || null;
    } catch {}

    const headerImage = appDetails?.header_image || `https://cdn.cloudflare.steamstatic.com/steam/apps/${best.appid}/header.jpg`;
    const storeUrl = `https://store.steampowered.com/app/${best.appid}/`;

    return buildLiveGame(best.appid, best.name, headerImage, storeUrl, appDetails, best.count);
  }

  /**
   * Selects the best live game from a list (highest Steam recommendations).
   */
  static selectBestLiveGame(liveGames: SteamLiveGame[]): SteamLiveGame | null {
    if (liveGames.length === 0) return null;
    return liveGames.sort((a, b) => b.recommendations - a.recommendations)[0];
  }
}
