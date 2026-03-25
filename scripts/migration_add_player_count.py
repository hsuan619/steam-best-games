"""
migration_add_player_count.py
新增 player_count 欄位到 games 資料表，並依簡介文字自動推斷現有遊戲的人數標籤。
"""
import sqlite3
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = 'db/curator.sqlite'

def detect_player_count(description: str) -> str:
    """
    從 Steam 的簡短介紹推斷遊戲支援的玩家人數標籤。
    回傳值：'雙人' / '4人' / '4人以上'
    """
    text = description.lower()

    # 4人以上的關鍵字（優先判斷）
    patterns_4plus = [
        r'up to \d*[5-9]\d* players',
        r'\d*[5-9]\d* players',
        r'up to (six|seven|eight|nine|ten)',
        r'(five|six|seven|eight|nine|ten) players',
        r'1-8', r'2-8', r'3-8', r'4-8',
        r'up to 8', r'up to 6', r'up to 5',
        r'6 player', r'8 player', r'10 player',
        r'mmo', r'massively multiplayer',
        r'多人', r'大量玩家',
    ]
    for pattern in patterns_4plus:
        if re.search(pattern, text):
            return '4人以上'

    # 剛好 4 人的關鍵字
    patterns_4 = [
        r'up to 4 players', r'1-4 players', r'2-4 players', r'3-4 players',
        r'four players', r'4 player', r'最多四人', r'最多4人',
    ]
    for pattern in patterns_4:
        if re.search(pattern, text):
            return '4人'

    # 雙人的關鍵字
    patterns_2 = [
        r'two.player', r'2.player', r'dual', r'partner',
        r'co-op for 2', r'1-2 player', r'2 player', r'雙人', r'限定雙人',
    ]
    for pattern in patterns_2:
        if re.search(pattern, text):
            return '雙人'

    # 預設為 4人以上（大部分多人遊戲都支援超過4人）
    return '4人以上'


def migrate():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    # 檢查欄位是否已存在
    cur.execute("PRAGMA table_info(games)")
    cols = [row['name'] for row in cur.fetchall()]
    if 'player_count' not in cols:
        cur.execute("ALTER TABLE games ADD COLUMN player_count TEXT NOT NULL DEFAULT '4人以上'")
        print("✅ 已新增 player_count 欄位")
    else:
        print("ℹ️  player_count 欄位已存在，跳過新增")

    # 用現有遊戲的 description_zh 推斷並更新
    cur.execute("SELECT appid, title, description_zh FROM games")
    games = cur.fetchall()
    updated = 0
    for g in games:
        count = detect_player_count(g['description_zh'])
        cur.execute("UPDATE games SET player_count=? WHERE appid=?", (count, g['appid']))
        print(f"  {g['title']}: {count}")
        updated += 1

    conn.commit()
    conn.close()
    print(f"\n✅ 完成！共更新 {updated} 款遊戲的人數標籤。")


if __name__ == '__main__':
    migrate()
