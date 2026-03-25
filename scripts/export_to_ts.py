import sqlite3
import json
import os

DB_PATH = 'db/curator.sqlite'
OUTPUT_TS = 'src/data/articles.ts'

def export_data():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM categories')
    categories = cursor.fetchall()

    articles = []

    for cat_index, cat in enumerate(categories):
        cat_dict = {
            "id":          cat["id"],
            "category":    cat["category"],
            "date":        cat["date"],
            "title":       cat["title"],
            "description": cat["description"],
            "heroImage":   cat["hero_image"],
            "games":       []
        }

        # 取得此分類的遊戲
        cursor.execute('''
        SELECT g.appid, g.title, g.description_zh, g.image_url,
               g.steam_url, g.player_count
        FROM games g
        JOIN recommendations r ON g.appid = r.game_appid
        WHERE r.category_id = ?
        ''', (cat["id"],))

        games = cursor.fetchall()

        for game_index, g in enumerate(games):
            # 從 game_comments 取此遊戲的所有留言，依輪替索引選取
            # 用 (cat_index + game_index) 確保同款遊戲在不同文章中用不同留言
            cursor.execute('''
            SELECT comment FROM game_comments
            WHERE game_appid = ?
            ORDER BY id
            ''', (g["appid"],))
            all_comments = [row["comment"] for row in cursor.fetchall()]

            if all_comments:
                chosen = all_comments[(cat_index + game_index) % len(all_comments)]
            else:
                chosen = ""

            cat_dict["games"].append({
                "id":            g["appid"],
                "title":         g["title"],
                "description":   g["description_zh"],
                "threadsComment": chosen,
                "imageUrl":      g["image_url"],
                "steamUrl":      g["steam_url"],
                "playerCount":   g["player_count"]
            })

        articles.append(cat_dict)

    conn.close()

    # 讀取現有 articles.ts，保留不在 DB 中的主題文章（publish_blog_by_theme 產生的）
    existing_pinned = []
    db_category_ids = {a["id"] for a in articles}
    if os.path.exists(OUTPUT_TS):
        try:
            with open(OUTPUT_TS, 'r', encoding='utf-8') as f:
                content = f.read()
            start = content.index('[')
            end   = content.rindex(']') + 1
            existing_articles = json.loads(content[start:end])
            existing_pinned = [a for a in existing_articles if a.get('id') not in db_category_ids]
            if existing_pinned:
                print(f"保留 {len(existing_pinned)} 篇主題文章：{[a['id'] for a in existing_pinned]}")
        except Exception as e:
            print(f"警告：無法讀取現有 articles.ts，略過保留主題文章。({e})")

    all_articles = articles + existing_pinned

    # 寫出 TS 檔案
    ts_content  = "import { Article } from '../types';\n\n"
    ts_content += "export const articles: Article[] = "
    ts_content += json.dumps(all_articles, ensure_ascii=False, indent=2)
    ts_content += ";\n"

    os.makedirs(os.path.dirname(OUTPUT_TS), exist_ok=True)
    with open(OUTPUT_TS, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"Exported {len(all_articles)} articles to {OUTPUT_TS}")

if __name__ == '__main__':
    export_data()
