import { NavOption } from './types';

/**
 * 系統頂部主要導航列選單常數
 * 集中管理連結路徑，避免在多處使用 Magic Strings。
 */
export const NAV_LINKS: NavOption[] = [
  { label: 'Blog', href: '/' }
];

/**
 * 部落格專用的熱門標籤常數
 * 提供右側欄快速檢索的選項。
 */
export const POPULAR_TAGS: string[] = [
  'Co-op',
  'Party Games',
  'Horror',
  'Survival',
  'Indie'
];
