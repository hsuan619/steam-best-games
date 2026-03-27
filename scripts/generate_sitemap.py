import sqlite3
import datetime
import os

DB_PATH = 'db/curator.sqlite'
OUTPUT_SITEMAP = 'public/sitemap.xml'
BASE_URL = 'https://hsuan619.github.io/steam-best-games'

def generate_sitemap():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute('SELECT id, date FROM categories')
    categories = cursor.fetchall()
    conn.close()

    now = datetime.datetime.now().strftime('%Y-%m-%d')
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # 首頁
    xml_content += f'  <url>\n    <loc>{BASE_URL}/</loc>\n    <lastmod>{now}</lastmod>\n    <priority>1.0</priority>\n  </url>\n'
    
    # 文章分頁
    for cat in categories:
        xml_content += f'  <url>\n    <loc>{BASE_URL}/{cat["id"]}</loc>\n    <lastmod>{cat["date"]}</lastmod>\n    <priority>0.8</priority>\n  </url>\n'
        
    xml_content += '</urlset>'

    os.makedirs(os.path.dirname(OUTPUT_SITEMAP), exist_ok=True)
    with open(OUTPUT_SITEMAP, 'w', encoding='utf-8') as f:
        f.write(xml_content)

    print(f"Sitemap generated at {OUTPUT_SITEMAP}")

if __name__ == '__main__':
    generate_sitemap()
