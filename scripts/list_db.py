import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = 'db/curator.sqlite'

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# 顯示所有分類
print('=== 分類列表 (Categories) ===')
for r in cur.execute('SELECT id, category FROM categories'):
    print(f'  [{r["id"]}] {r["category"]}')

print()
print('=== 資料庫內所有遊戲 ===')

# 依分類列出所有遊戲
cur.execute('''
  SELECT g.appid, g.title, g.player_count, r.category_id, r.threads_comment
  FROM games g
  JOIN recommendations r ON g.appid = r.game_appid
  ORDER BY r.category_id, g.title
''')

current_cat = None
for r in cur.fetchall():
    if r['category_id'] != current_cat:
        current_cat = r['category_id']
        print(f'\n  [{current_cat}]')
    # 截斷過長的留言以便閱讀
    comment = r['threads_comment'][:50] + '...' if len(r['threads_comment']) > 50 else r['threads_comment']
    print(f'    - {r["title"]} [{r["player_count"]}] (appid: {r["appid"]})')
    print(f'      💬 {comment}')

print()
cur.execute('SELECT COUNT(*) as total FROM games')
print(f'=== 共 {cur.fetchone()["total"]} 款遊戲 ===')
conn.close()
