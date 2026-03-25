---
name: build_blog_by_threads
description: 從 Threads 貼文網址自動爬取遊戲推薦留言，結合 Steam API 獲取官方資料，分類後寫入本地資料庫。不自動發布到 Blog，需手動執行匯出。
---

# Build Blog by Threads

這個技能可以將一篇討論「遊戲推薦」的 Threads 貼文，自動轉化為結構化且具有吸引力的 Blog 推薦文章，並具備 Steam 官方商店資料的背書。

## 執行流程 (Workflow)

當收到使用本技能的指令，且附帶一段 Threads 網址時，請嚴格遵循以下步驟：

### 第一步：排重檢查 + 撈取 Threads 資料 (Dedup & Data Extraction)
**先執行排重檢查（關鍵）：**
1. 確認使用者提供的 Threads 文章網址（URL）。
2. 查看 `db/scraped_threads.json`，若該 URL 已存在於清單中 → **立即終止，回報「此文章已爬取過」**，不繼續任何動作。
3. 若 URL 為全新，才繼續以下爬取步驟。

**爬取留言：**
4. 使用 `browser_subagent` 瀏覽該 Threads 貼文網址，完整展開留言串。
5. 擷取推薦的「遊戲名稱」與「留言者帳號 + 留言內容」。
   - **過濾條件（關鍵）：** 只節錄「同時包含推薦與個人感想/心得」的留言，純遊戲名稱或「推 +1」等無意義短語請略過。
   - **已有遊戲也可追加**：資料庫內已存在的遊戲**不要跳過**，只需將新留言追加到 `game_comments` 表格即可，不覆蓋原有資料。

### 第二步：Steam 官方資料媒合與寫入 (Steam Data Fetching & DB Insert)
1. 使用 `fetch_steam_data.py` 將名單寫入資料庫，**必須帶入 Threads 來源資訊**：
   ```
   python fetch_steam_data.py \
     --query "遊戲名稱" \
     --comment "網友留言" \
     --category "類別ID" \
     --threads-url "https://www.threads.com/@xxx/post/xxx" \
     --threads-author "@留言者帳號"
   ```
   - 若遊戲已存在於 DB，腳本會自動跳過更新 `games` 表格，只在 `game_comments` 追加留言。
   - 若遊戲全新，腳本會先從 Steam API 撈取官方資料再寫入。
2. 腳本在最後會自動把此 Threads URL 記錄進 `db/scraped_threads.json`。

### 第三步：分類與 Blog 主題企劃 (Categorization & Ideation)
1. 依據上一步取得的 Steam 官方類型標籤，確認這是哪種類型的多人遊戲。
2. 將所有遊戲歸納為 3~5 個大群組（例如：派對破壞友誼、燒腦解謎合作、精神時光屋等）。
3. **創意發想**：為每個分類群組撰寫一個極具吸引力與創意的「文章標題 (Title)」以及「文章導讀 (Description)」。保持幽默、有趣且貼近玩家社群的口吻。

### 第四步：確認寫入完成後停止 (DB Commit & Stop)
1. 所有新遊戲都已透過 `fetch_steam_data.py` 寫入資料庫即完成本技能的工作。
2. **不要自動執行** `python scripts/export_to_ts.py`。
3. 最後回報給使用者哪些遊戲已成功入庫、哪些已略過（重複或無效留言），讓使用者自行決定是否執行發布。


## 技能觸發條件
- 當使用者提供一個包含遊戲討論的 Threads 連結。
- 當使用者明確要求："將這篇 Threads 整理成推薦文章" 等關鍵字。

## 預期成果 (Expected Output)
- 新遊戲資料寫入 `db/curator.sqlite`，**不自動更新前端**。
- 回報入庫清單（成功/略過）供使用者確認。

