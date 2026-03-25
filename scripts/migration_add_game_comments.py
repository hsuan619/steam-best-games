"""
migration_add_game_comments.py
1. 建立 game_comments 資料表
2. 將現有 recommendations.threads_comment 資料 migrate 進去
3. 建立 db/scraped_threads.json（初始為空陣列）
"""
import sqlite3
import json
import os
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = 'db/curator.sqlite'
SCRAPED_JSON = 'db/scraped_threads.json'

def migrate():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    # ── 1. 建立 game_comments 資料表 ──────────────────────────────────────
    cur.execute('''
    CREATE TABLE IF NOT EXISTS game_comments (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        game_appid INTEGER NOT NULL,
        threads_url  TEXT NOT NULL DEFAULT '',
        author       TEXT NOT NULL DEFAULT 'unknown',
        comment      TEXT NOT NULL,
        created_at   TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        FOREIGN KEY (game_appid) REFERENCES games (appid)
    )
    ''')
    print('✅ game_comments 資料表已建立')

    # ── 2. 將現有 recommendations.threads_comment migrate 進去 ───────────
    cur.execute('SELECT * FROM recommendations')
    recs = cur.fetchall()
    migrated = 0
    for r in recs:
        comment = r['threads_comment']
        if not comment:
            continue
        # 檢查是否已 migrate（避免重複）
        cur.execute(
            'SELECT id FROM game_comments WHERE game_appid=? AND comment=?',
            (r['game_appid'], comment)
        )
        if cur.fetchone():
            continue
        cur.execute('''
        INSERT INTO game_comments (game_appid, threads_url, author, comment)
        VALUES (?, ?, ?, ?)
        ''', (r['game_appid'], '', 'migrated', comment))
        migrated += 1

    conn.commit()
    conn.close()
    print(f'✅ 已 migrate {migrated} 筆留言到 game_comments')

    # ── 3. 建立 scraped_threads.json（若尚未存在）────────────────────────
    if not os.path.exists(SCRAPED_JSON):
        with open(SCRAPED_JSON, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        print(f'✅ 已建立 {SCRAPED_JSON}（初始為空陣列）')
    else:
        print(f'ℹ️  {SCRAPED_JSON} 已存在，略過建立')


if __name__ == '__main__':
    migrate()
