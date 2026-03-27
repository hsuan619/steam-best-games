---
name: steam-live-widget
description: 根據 fetch_steam_data.py 結果與 steamAppId，自動判斷並在頁面右下角顯示 Steam 風格的多人遊戲直播漂浮視窗。
---

# Steam Live Floating Widget 實作指南

## 模組職責分離
此功能採用模組化的架構設計，嚴格遵守 clean-code，確保 UI、資料流、與狀態管理的獨立性：

1. **`SteamLiveFloatingWidget.tsx` (UI 層)**
   - 負責右下角固定定位 (`fixed bottom-6 right-6`)。
   - 負責平滑動畫 (`AnimatePresence` 與 `motion.div`) 來達成淡入、淡出、隨頁面捲動跟隨顯示。
   - **收納 / 展開設計 (Collapsible)**：允許使用者點擊標題列向下摺疊隱藏實況內容，只保留頂部狀態列，不會影響使用者的閱讀視線。
   - 處理 `'active'` (有直播) 與 `'empty'` (尚無直播) 兩種狀態的切換顯示，保證若無直播時視窗依然存在並顯示提示字樣。
   - 點擊視窗內預覽影像或文字後，開啟遊戲或實況的目標頁面。
   - 完全不干涉 API 邏輯或延遲邏輯。

2. **`useSteamLiveStatus.ts` (狀態與週期管理層)**
   - 封裝 Custom Hook，提供 `status` ('loading' | 'active' | 'empty' | 'hidden') 與目前的 `activeGame`。
   - 依據 React 生命週期管理 Timeout 與 Interval，實作 60 秒輪詢更新 (Polling) 機制，並控制 **4-Tier 的直播尋找優先順序**。

3. **`SteamLiveService.ts` (資料邏輯層)**
   - **4-Tier Fallback 降級尋找邏輯**：
     1. **當前類別推薦遊戲 (Tier 1)**：優先批次檢查目前 Blog 該頁面遊戲推薦清單 (`article.games`) 的直播與促銷狀態。
     2. **同類別其他遊戲 (Tier 2)**：若未找到，改找 Steam 商城中「相同類別標籤」且正在特價 (`specials=1`) 的遊戲直播，維持在目前情境中的連貫性。
     3. **全站特惠遊戲 (Tier 3)**：若前兩者皆未尋獲，最後無條件尋找 Steam 全站其他任何正在特價中的遊戲直播。
     4. **無任何直播 (Tier 4)**：若上述三層皆落空，則回傳空值，觸發 UI 畫面的「尚無直播」狀態顯示。
   - 若多款遊戲同時直播，利用 `selectBestLiveGame` 篩選「Steam 評價數 (recommendations.total)」最高的那一款顯示。

4. **`types.ts`**
   - 定義明確介面 `SteamLiveGame` 與 `SteamLiveStatus`，嚴格把關型別。

## 整合方式 (只在 Blog 遊戲類別頁面顯示)

為了保證「只有點進 blog 頁面下的各遊戲類別頁面時才顯示」，我們不需要在全站的 `App.tsx` 設計複雜的路徑判斷。
只要直接在對應的路由元件 **`src/pages/ArticleDetail.tsx`** 內掛載元件即可：

```tsx
import { SteamLiveFloatingWidget } from '../components/SteamLiveFloatingWidget';

export const ArticleDetail: React.FC = () => {
  // ... 其他程式碼
  return (
    <main>
      {/* ... 頁面內容 */}
      
      {/* 只要離開 ArticleDetail.tsx，此元件就會自動 Unmount，達成自動隱藏 */}
      <SteamLiveFloatingWidget games={article.games} />
    </main>
  );
};
```

## 如何跟 fetch_steam_data.py 連動
1. `fetch_steam_data.py` 執行後會產生 `steam_data.json` 或 `articles.ts`。
2. `ArticleDetail.tsx` 從資料庫 / JSON 中讀出 `article.games` 陣列（內含 `steamAppId`）。
3. `<SteamLiveFloatingWidget games={article.games} />` 收到陣列後，往下傳給 `useSteamLiveStatus`。
4. `SteamLiveService` 用這些 `steamAppId` 取回真正的直播資料。
5. 若 `games` 內沒有任何有效 ID 或皆無人直播，`SteamLiveService` 會回傳空陣列，`status` 變為 `'hidden'`，觸發 `framer-motion` 的 `exit` 平滑淡出事件。

---

## 預期呈現優化效果 (Enhancements & Expected Visuals)
為幫助讀者獲得最佳的無干擾閱讀體驗，請確保實況視窗具備以下收納與摺疊效果：
1. **點擊 Header 收納**：頂部的 `LIVE BROADCAST` 狀態列應作為按鈕（帶有 Hover 效果），並在其右側加入 `expand_more` / `expand_less` 箭頭指示器。
2. **平滑的滑動動畫**：當使用者點擊摺疊時，利用 Framer Motion 的高度過渡動畫 (`height: 0` to `height: auto`)，讓整個直播預覽圖跟文字介紹滑順地自動向上捲收。
3. **無干擾閱讀**：收納後，整個漂浮視窗只會剩下最頂部那一條窄窄的狀態列留在頁面右下角，既保留了「目前有直播」的提示，又絕對不會擋住讀者觀看 Blog 的文章內容。
4. **功能維持正常**：無論是「有實況 (`active`)」還是「尚無實況 (`empty`)」的狀態下，此套收納系統都必須能完美運作。
5. **預期互動邏輯分離**：點擊圖片或文字可以直接另開視窗前往實況頁面，而點擊頂部狀態列則單純觸發收納折疊，兩者的互動邏輯必須完美分開。
