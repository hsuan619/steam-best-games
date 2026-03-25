/**
 * 專案共用型別定義檔
 * 集中管理所有的資料傳遞介面，提高程式碼可讀性與維護性。
 */

/**
 * @interface GameRecommendation
 * @description 代表單款推薦遊戲的詳細資料，用於 Blog 主題文章渲染。
 */
export interface GameRecommendation {
  /** 遊戲在資料庫或 Steam 的唯一 ID */
  id: number;
  /** 遊戲顯示名稱 */
  title: string;
  /** 遊戲的簡短描述或推坑標語 */
  description: string;
  /** 從 Threads 社群抓取來的真實留言 */
  threadsComment: string;
  /** 遊戲封面預覽圖網址 */
  imageUrl: string;
  /** 前往 Steam 官方商店的網址 */
  steamUrl: string;
  /** 遊玩人數標籤 (如: 雙人, 4人以上) */
  playerCount?: string;
}

/**
 * @interface Article
 * @description 代表單篇完整的 Blog 主題推薦文章，涵蓋多款遊戲。
 */
export interface Article {
  /** 文章的 URL Slug 識別碼，如 'casual-party' */
  id: string;
  /** 文章所屬的大分類名稱 */
  category: string;
  /** 文章發布或更新日期 */
  date: string;
  /** 文章的主標題 */
  title: string;
  /** 文章的前導描述文字 */
  description: string;
  /** 文章的滿版焦點圖首曝網址 */
  heroImage: string;
  /** 該篇文章內所包含的推薦遊戲陣列 */
  games: GameRecommendation[];
}

/**
 * @interface NavOption
 * @description 系統頂部導覽列或側邊欄的連結定義。
 */
export interface NavOption {
  /** 顯示名稱 */
  label: string;
  /** 前往的路徑 */
  href: string;
  /** 搭配的 Material Symbols Icon（選填） */
  icon?: string;
}

/**
 * @interface Game
 * @description 代表基本推薦遊戲卡片的資料介面 (用於首頁/探索頁)
 */
export interface Game {
  id: number;
  title: string;
  image: string;
  players: string;
  description: string;
  whyFun?: string;
}
