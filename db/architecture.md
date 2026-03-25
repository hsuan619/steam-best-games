db/
├── curator.sqlite
│   ├── games            ← 遊戲主資料（不重複）
│   ├── game_comments    ← 多筆留言（同款可累積）
│   ├── recommendations  ← 遊戲 ↔ 分類關聯
│   └── categories       ← 分類定義
└── scraped_threads.json ← 已爬取的 Threads URL 清單
##python scripts/list_db.py
