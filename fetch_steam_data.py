import urllib.request
import urllib.parse
import json
import time
import os
import sys
import sqlite3
import argparse
import re
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = 'db/curator.sqlite'
SCRAPED_JSON = 'db/scraped_threads.json'

# ── 工具函式 ───────────────────────────────────────────────────────────────

def detect_player_count(description: str) -> str:
    """從 Steam 簡介推斷玩家人數標籤，回傳 '雙人' / '4人' / '4人以上'"""
    text = description.lower()
    if re.search(r'(up to [5-9]|up to 1\d|[5-9] player|1[0-9] player|1-8|2-8|4-8|mmo|massively|多人|大量玩家)', text):
        return '4人以上'
    if re.search(r'(up to 4|1-4|2-4|3-4|four player|4 player|最多四人|最多4人)', text):
        return '4人'
    if re.search(r'(two.player|2.player|dual|co-op for 2|1-2 player|雙人|限定雙人)', text):
        return '雙人'
    return '4人以上'

def is_threads_url_scraped(url: str) -> bool:
    """檢查 scraped_threads.json，若 URL 已存在則回傳 True"""
    if not os.path.exists(SCRAPED_JSON):
        return False
    with open(SCRAPED_JSON, 'r', encoding='utf-8') as f:
        scraped = json.load(f)
    return any(entry.get('url') == url for entry in scraped)

def record_scraped_url(url: str, author: str):
    """將已爬取的 Threads URL 記錄進 scraped_threads.json"""
    scraped = []
    if os.path.exists(SCRAPED_JSON):
        with open(SCRAPED_JSON, 'r', encoding='utf-8') as f:
            scraped = json.load(f)
    scraped.append({
        'url': url,
        'author': author,
        'scraped_at': datetime.now().isoformat()
    })
    with open(SCRAPED_JSON, 'w', encoding='utf-8') as f:
        json.dump(scraped, f, ensure_ascii=False, indent=2)

def search_steam(term):
    """在 Steam 搜尋遊戲，回傳 appid"""
    url = f"https://store.steampowered.com/api/storesearch/?term={urllib.parse.quote(term)}&l=tchinese&cc=TW"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data.get('total', 0) > 0:
                return data['items'][0]['id']
    except Exception as e:
        print(f"Error searching {term}: {e}")
    return None

def get_app_details(appid):
    """取得 Steam 遊戲詳細資訊"""
    url = f"https://store.steampowered.com/api/appdetails?appids={appid}&l=tchinese"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if str(appid) in data and data[str(appid)].get('success'):
                return data[str(appid)]['data']
    except Exception as e:
        print(f"Error getting details for appid {appid}: {e}")
    return None

def insert_into_db(game_data):
    """
    將遊戲資料寫入 DB。
    - games：INSERT OR IGNORE（已存在則跳過覆蓋，保護現有的 description_zh）
    - game_comments：一律 INSERT（允許同一遊戲有多筆留言）
    - recommendations：INSERT（若遊戲已在此分類則不重複新增）
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    appid          = game_data['appid']
    title          = game_data['title']
    desc           = game_data['short_description']
    image_url      = game_data['header_image']
    steam_url      = game_data['url']
    player_count   = game_data['player_count']
    category_id    = game_data['category']
    comment        = game_data['threads_comment']
    threads_url    = game_data.get('threads_url', '')
    threads_author = game_data.get('threads_author', 'unknown')

    # 1. 確認分類存在
    cursor.execute('SELECT id FROM categories WHERE id=?', (category_id,))
    if not cursor.fetchone():
        print(f"Warning: Category '{category_id}' does not exist.")
        conn.close()
        return False

    # 2. 寫入 games（已存在就跳過，不覆蓋原有資料）
    cursor.execute('''
    INSERT OR IGNORE INTO games (appid, title, description_zh, image_url, steam_url, player_count)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (appid, title, desc, image_url, steam_url, player_count))

    game_already_existed = cursor.rowcount == 0  # 若為 0 表示原本就有

    # 3. 寫入 game_comments（允許同款遊戲追加多筆留言）
    if comment:
        # 避免完全相同的留言重複寫入
        cursor.execute(
            'SELECT id FROM game_comments WHERE game_appid=? AND comment=?',
            (appid, comment)
        )
        if not cursor.fetchone():
            cursor.execute('''
            INSERT INTO game_comments (game_appid, threads_url, author, comment)
            VALUES (?, ?, ?, ?)
            ''', (appid, threads_url, threads_author, comment))

    # 4. 寫入 recommendations（同一遊戲在同一分類只建一筆）
    cursor.execute(
        'SELECT id FROM recommendations WHERE category_id=? AND game_appid=?',
        (category_id, appid)
    )
    if not cursor.fetchone():
        cursor.execute('''
        INSERT INTO recommendations (category_id, game_appid, threads_comment)
        VALUES (?, ?, ?)
        ''', (category_id, appid, comment))

    conn.commit()
    conn.close()

    status = '（遊戲已存在，追加新留言）' if game_already_existed else '（新遊戲）'
    print(f"✅ '{title}' → 分類 '{category_id}' {status}")
    return True


# ── 主程式 ────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Fetch Steam data and add to the Digital Curator DB.")
    parser.add_argument("--query",          type=str, help="遊戲搜尋名稱（單筆模式）")
    parser.add_argument("--comment",        type=str, default="", help="Threads 留言（必須含推薦理由）")
    parser.add_argument("--category",       type=str, default="casual-party", help="分類 ID（casual-party / action-puzzle / survival-sim / horror-strategy）")
    parser.add_argument("--threads-url",    type=str, default="", help="來源 Threads 貼文網址")
    parser.add_argument("--threads-author", type=str, default="unknown", help="留言者帳號")
    parser.add_argument("--input",          type=str, help="批次處理用 JSON 檔案路徑")
    args = parser.parse_args()

    if not args.query and not args.input:
        parser.print_help()
        sys.exit(1)

    # ── Threads URL 排重檢查（僅批次模式或提供 --threads-url 時） ────────
    threads_url = args.threads_url
    if threads_url:
        if is_threads_url_scraped(threads_url):
            print(f"⛔ 此 Threads 文章已爬取過，終止動作：{threads_url}")
            sys.exit(0)

    games_list = []

    if args.input:
        try:
            with open(args.input, 'r', encoding='utf-8') as f:
                input_data = json.load(f)
                games_list = input_data.get('games', [])
                # 批次模式：從 JSON 中讀取 threads_url 做排重
                batch_url = input_data.get('threads_url', '')
                if batch_url:
                    if is_threads_url_scraped(batch_url):
                        print(f"⛔ 此 Threads 文章已爬取過，終止動作：{batch_url}")
                        sys.exit(0)
                    threads_url = batch_url
        except FileNotFoundError:
            print(f"Error: Could not find {args.input}")
            sys.exit(1)
    elif args.query:
        games_list.append({
            "game_name":      args.query,
            "comment":        args.comment,
            "category":       args.category,
            "threads_url":    threads_url,
            "threads_author": args.threads_author
        })

    print(f"Starting Steam API fetch for {len(games_list)} games...")
    success_count = 0

    for item in games_list:
        game_query     = item.get("game_name", "")
        comment        = item.get("comment", "")
        category       = item.get("category", args.category)
        t_url          = item.get("threads_url", threads_url)
        t_author       = item.get("threads_author", args.threads_author)

        if not game_query:
            continue

        print(f"Searching for {game_query}...")
        appid = search_steam(game_query)
        if appid:
            details = get_app_details(appid)
            if details:
                short_description = details.get('short_description', '')
                game_data = {
                    "query":          game_query,
                    "title":          details.get('name', game_query),
                    "appid":          appid,
                    "short_description": short_description,
                    "header_image":   details.get('header_image', ''),
                    "url":            f"https://store.steampowered.com/app/{appid}/",
                    "threads_comment": comment,
                    "category":       category,
                    "player_count":   detect_player_count(short_description),
                    "threads_url":    t_url,
                    "threads_author": t_author
                }
                if insert_into_db(game_data):
                    success_count += 1
            else:
                print(f"Could not get details for appid {appid}.")
        else:
            print(f"Could not find '{game_query}' on Steam.")

        time.sleep(1)  # Be nice to Steam API

    # ── 記錄已爬取的 Threads URL ─────────────────────────────────────────
    if threads_url and success_count > 0:
        record_scraped_url(threads_url, args.threads_author)
        print(f"📝 已記錄 Threads URL：{threads_url}")

    print(f"Done! Processed {len(games_list)} games, {success_count} successfully added/updated.")

if __name__ == '__main__':
    main()
