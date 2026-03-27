---
name: steam-sale-tracker
description: 實作「懸停觸發」的 Steam 特價追蹤功能。自動分析 Threads 提到的遊戲，並在文章詳情頁的圖片 Hover 狀態下顯示特價資訊與趨勢曲線。
---

# Steam Sale Tracker Skill

**Role:** Senior Full-Stack Developer
**Task:** 實作「懸停觸發」的 Steam 特價追蹤功能

## 1. 核心邏輯
- 建立一個 `SteamSaleService.ts`。使用 Steam Store API 獲取遊戲資訊。
- 實作名稱清洗邏輯，將文章中的遊戲標題轉換為 Steam AppID。
- **快取與效能優化 (In-Memory Cache & Lazy Load)**：
    - `SteamSaleService.ts` 內需靜態紀錄已查詢過的 `_appIdCache` 與 `_priceCache`，避免同一分頁內重複發送代理請求。
    - Steam 官方 API 不提供歷史價格，因此需實作**動態歷史折扣模擬**：只提取「過去 12 個月內」的真實 Steam 各大特賣節檔期（如春季特賣、夏日特賣、自動節、新品節...等），針對每個特賣檔期產生專屬的降價模擬節點，並且不可全都顯示成原價的一條死板直線。
    - **保留真實的現在**：陣列最後一個節點（現在這個月）依然需真實反應 Steam API 拉取到的真實當前價格，若無特價就是原價，若有特價則是真實的優惠價。

## 2. 交互組件 (SteamHoverTracker.tsx)
- 此組件需包裹遊戲圖片。
- 預設狀態：僅顯示遊戲圖片（遵循現有 Blog 排版）。
- Hover 狀態：在圖片右側彈出一個透明感面板 (Motion Framer Overlay)。
- **延遲請求機制 (On-Demand Fetch)**：僅在使用者「第一次 Hover」時才觸發 API 請求 (`fetchData()`)，以徹底防範伺服器 Rate Limit（讀取失敗、被限制）等狀況，嚴禁在組件掛載時就大量派送請求。
- 面板內容：
    - 當前折扣 (Initial vs Final Price)。
    - 使用 Recharts 繪製過去一年價格曲線，X 軸標示特賣日期。
    - **Custom Tooltip 提示強化**：每點除了顯示該特賣檔期的「模擬促銷價」與「折數」之外，必須額外加上「特賣節的名稱標籤」（如：秋季特賣、動物節），最後一個點需標示為「現在」。
    - 智慧建議：對比當前價與歷史最低價，給出「建議入手」或「再等等」的標語。

## 3. 頁面整合
- 修改 `ArticleDetail.tsx`（或文章推薦渲染組件如 `ArticleGameCard.tsx`）。確保文章中提到的「每一款遊戲」的媒體區塊（圖片/影片）都具備此 Hover 監聽。
- 如果 Steam API 找不到該遊戲（無特價資訊），則靜默不顯示任何 Hover 效果。

## 4. 技術棧要求
- UI: React, Tailwind CSS, Framer Motion (用於平滑彈出)。
- Charts: Recharts。
- API: Steam Store API (appdetails)。

---

## Deliverables
執行此 Skill 完成實作後，請提供以下輸出：
1. 直接輸出修改後的程式碼與檔案清單。
2. 說明如何透過修改 `articles.ts` 內容來測試此功能。

---

## 5. 預期呈現優化效果 (Enhancements & Expected Visuals)
為幫助讀者更直覺了解特價趨勢，請確保圖表具備以下視覺效果：
- **精準特賣檔期**：趨勢圖的節點全面採用「近一年內 Steam 官方各大特賣節」的實際檔期。`SteamHoverTracker` 需能動態運算距離今天「過去 12 個月內」發生過的特賣節（如夏日特賣、新品節、秋季特賣等），並為每個節點配上一個專屬的促銷價格。
- **Tooltip 小巧思**：在 Hover 的趨勢圖 Tooltip 內，除了清晰呈現日期與價格外，還會明確標示出該節點對應的「特賣節名稱」（例如：`秋季特賣`、`新品節`），這樣讀者在觀看歷史價格時會對促銷時機點更有感！
- **真實驗證「現在」**：最後一個節點（現在）會根據真實的 Steam API 狀態判斷，若無特價則顯示原價，有特價則顯示實時優惠價，並將節點名稱明確標示為「現在」作為價格趨勢的終點結語。
