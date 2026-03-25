---
name: publish_blog_by_theme
description: 根據使用者給定的主題，從 SQLite 資料庫篩選 6-8 款遊戲，自動構思創意分類企劃，確認後才發布到 Blog。
---

# Publish Blog by Theme

## 技能觸發條件
- 使用者給定一個主題，如：「雙人」、「四人」、「恐怖」、「免費」、「經典必玩」等。

---

## 執行流程 (Workflow)

### 第一步：從資料庫篩選 6~8 款遊戲
查詢 `db/curator.sqlite`，依主題篩選：

| 使用者主題 | 篩選邏輯 |
|---|---|
| 雙人 | `player_count = '雙人'` |
| 四人 / 4人以上 | `player_count IN ('4人', '4人以上')` |
| 恐怖 | `category_id = 'horror-strategy'` |
| 派對 / 休閒 | `category_id = 'casual-party'` |
| 生存 / 建造 | `category_id = 'survival-sim'` |
| 解謎 / 動作 | `category_id = 'action-puzzle'` |
| 免費 | `description_zh` 含「免費」關鍵字 |
| 經典必玩 | 跨分類，人工判斷知名度高 + 留言熱情度高者 |

若同一主題下遊戲超過 8 款，優先選 `game_comments` 中留言最精彩（感情最濃、最有推薦感）的遊戲。

---

### 第二步：閱讀入選遊戲找共通點
仔細閱讀每款遊戲的 `description_zh` 與 **`game_comments` 中最精彩的一條留言**，找出玩法特色、情感體驗、留言語氣的共通點，**不用再細分子類別**，只需為整體文章找到一個強力主題切入點。

---

### 第三步：撰寫創意文章標題與導讀
為這篇 Blog 文章撰寫：
1. **文章大標題 (title)**：帶表情符號、有個性、吸引眼球。
2. **文章導讀 (description)**：2～3 句，語氣像在跟朋友推薦，幽默輕鬆，不官方。

範例風格：
- `🔪 最容易毀掉友情的遊戲合集（但你們還是會一直玩）`
- `🧠 兩個人的秘密宇宙：最燒腦的雙人合作精選`
- `🏕️ 週末精神時光屋：一起在荒野活下去的生存遊戲`

---

### 第四步：展示企劃給使用者確認
將以下內容整理後呈現給使用者：
- 文章大標題 & 導讀
- 入選遊戲名單（含 `player_count` 標籤與精選 `game_comments` 留言節錄）

**等待使用者回覆「OK」或要求調整，禁止在此步驟做任何寫入。**

---

### 第五步：確認後直接發布到 Blog (Direct Append to TS)
**只要把設定好的 JSON 內容 Append 進 `src/data/articles.ts`，就是在發布 Blog 頁面了！** 完全不需要寫入資料庫，也不需要透過其他指令或腳本。

1. **組裝 Article JSON**：依照 `src/types.ts` 的定義，以程式碼直接宣告物件陣列的格式：
   - 確保帶入所有欄位（`id`, `category`, `date`, `title`, `description`, `heroImage`，還有包含 `playerCount` 等欄位的 `games` 陣列）。
   - 請直接使用原本 Steam 的標準縮圖路徑（例：`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/[APPID]/header.jpg`），**嚴禁使用非標準的複雜 Hash 網址，以免造成 404**。
2. **寫入檔案**：使用內容取代/編輯工具，將上述組裝好的主題文章 JSON，直接插入至 `src/data/articles.ts` 中的 `export const articles: Article[] = [` 第一個元素。
3. **完成發布**：告知使用者「文章與頁面發布完成！」，並列出入選遊戲。

> [!NOTE]
> `export_to_ts.py` 已更新為智慧合併模式：執行時會自動保留 `articles.ts` 中不在 DB 裡的主題文章，因此這篇文章**不會被覆蓋**。

