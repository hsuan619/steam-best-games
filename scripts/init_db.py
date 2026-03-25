import sqlite3
import json
import os

DB_PATH = 'db/curator.sqlite'

def init_db():
    os.makedirs('db', exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Drop existing tables to start fresh
    cursor.execute('DROP TABLE IF EXISTS recommendations')
    cursor.execute('DROP TABLE IF EXISTS games')
    cursor.execute('DROP TABLE IF EXISTS categories')

    # Create Categories Table
    cursor.execute('''
    CREATE TABLE categories (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        hero_image TEXT NOT NULL
    )
    ''')

    # Create Games Table
    cursor.execute('''
    CREATE TABLE games (
        appid INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description_zh TEXT NOT NULL,
        image_url TEXT NOT NULL,
        steam_url TEXT NOT NULL
    )
    ''')

    # Create Recommendations Table
    cursor.execute('''
    CREATE TABLE recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id TEXT NOT NULL,
        game_appid INTEGER NOT NULL,
        threads_comment TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories (id),
        FOREIGN KEY (game_appid) REFERENCES games (appid)
    )
    ''')

    conn.commit()
    return conn

def seed_data(conn):
    # This reflects exactly what was in articles.ts
    categories_data = [
        {
            "id": "casual-party",
            "category": "Party & Casual",
            "date": "MAR 25, 2026",
            "title": "🎉 輕鬆派對與休閒合作 (Casual Party & Co-op)",
            "description": "不論是互雷還是神隊友，這些休閒與派對遊戲絕對能為你的聚會帶來滿滿的笑聲（或爭執）。",
            "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuDTNkjslBtLqoVuEuIP5TaATXf2fuCUVysB3UfV1xX5NkBrLqOoI5lTVzSMKEjMAuYMLuET_rX34QEWHOL5kdz_pnJpPjrFjHxDKNL1ROwGcWKYkOpIlWBXKl-zQzW7C2ptYLEbCJtsBbROIgGjjmpDt9Xkd3Mz-pG6Tsap3WgcT1RLd9WwddxVS3lOprEmO5M_u2bpeqvX1QBaXbzW4mGr5Ul02s-ICMxtTIaT-acWE3cRh7tIoRcZY6La-ri1jNi6E7ZKjYz4S8pD",
            "games": [
                (477160, "Human Fall Flat", "《Human Fall Flat》是一款輕鬆爆笑的物理平台動作遊戲，遊戲舞台位於飄浮的夢境場景中。支援單人或多人連線合作解謎。非常適合和朋友互相陷害或是合力通關！", "好上手 有時有點小難度 便宜又常更新關卡推推！！ / 很可愛的遊戲，看朋友摔下去就覺得很好笑", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/477160/aa58c48b10d2435e94be407321c80fdd5c0a238f/header_alt_assets_27_tchinese.jpg", "https://store.steampowered.com/app/477160/"),
                (2644470, "PICO PARK 2", "《PICO PARK》系列新作！需要2～8人齊心協力突破萬難。即使看似簡單的關卡，一不小心也會因為豬隊友而重來！", "輕鬆合作的話可以玩PICOPARK，要考驗友情的絕對必玩這款！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2644470/header.jpg", "https://store.steampowered.com/app/2644470/"),
                (1260320, "猛獸派對 (Party Animals)", "這是一款基於物理的多人派對遊戲。選擇你喜歡的小動物角色，盡情痛扁你的好朋友，或者一起挑戰世界各地的玩家！", "猛獸派對還行，剛開始玩不錯，跟朋友打成一團滿好笑的，很適合放鬆一下。", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1260320/header.jpg", "https://store.steampowered.com/app/1260320/"),
                (728880, "Overcooked! 2", "《Overcooked! 2》為你端上全新的混亂烹飪動作！重返洋蔥王國，在各種奇葩的廚房中拯救世界。非常考驗分工與溝通，稍有不慎廚房就會燒起來！", "困難合作OverCooked絕對是經典，雖然常玩到吵架但過關會很有成就感！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/728880/header.jpg", "https://store.steampowered.com/app/728880/"),
                (386940, "超級雞馬 (Ultimate Chicken Horse)", "一款由玩家自行創作關卡的互動遊戲，藉由放置各種致命陷阱妨礙對手到達終點。但請小心，別栽在自己設下的陷阱前！", "超級雞馬超適合搞朋友，互相放陷阱真的超級歡樂！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/386940/header.jpg", "https://store.steampowered.com/app/386940/"),
                (673750, "超級兔子人 (Super Bunny Man)", "一款充滿混亂的物理合作平台遊戲！你需要與朋友一邊打滾跳躍，一邊將蘿蔔帶回終點。各種奇妙的死法絕對讓你們笑破肚皮。", "搞心態必提兔子人，互相踹下懸崖的時光最開心了😂", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/673750/header.jpg", "https://store.steampowered.com/app/673750/"),
                (837470, "Untitled Goose Game", "今天村裡的天氣很晴朗，不過你是一隻很可惡的鵝。現在支援雙人合作，兩隻鵝一起搗亂的威力絕對加倍！", "輕鬆推Untitled Goose Game，當個惡霸鵝欺負路人有種莫名的紓壓感。", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/837470/header.jpg", "https://store.steampowered.com/app/837470/"),
                (850320, "PHOGS!", "在《PHOGS!》中扮演一對相連的狗狗，踏上充滿謎題的冒險。你們需要合作通過食物、睡眠和娛樂三大滿是障礙的世界。", "可愛狗狗 簡單好上手，跟另一半玩很適合，畫面很療癒！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/850320/header.jpg", "https://store.steampowered.com/app/850320/")
            ]
        },
        {
            "id": "action-puzzle",
            "category": "Action & Puzzle",
            "date": "MAR 25, 2026",
            "title": "🧩 動作冒險與解謎闖關 (Action Adventure & Puzzle)",
            "description": "透過絕佳的雙人默契與技術，共同破解難題或擊敗強大的首領。以下是 Steam 上評價最高的雙人合作神作。",
            "heroImage": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg",
            "games": [
                (1426210, "雙人成行 (It Takes Two)", "在《雙人成行》中踏上人生中最瘋狂的旅程。這是一場純粹為雙人合作而設計的奇妙冒險，玩法多變且處處充滿驚喜。", "只要一個人買就好這點很佛心！每個關卡玩法都不一樣，真的會一直驚呼太神了！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg", "https://store.steampowered.com/app/1426210/"),
                (1222700, "A Way Out", "這是一款限定雙人合作的冒險遊戲，玩家將扮演兩名性格迥異的囚犯，展開大膽的越獄行動。分割畫面看著隊友犯傻絕對是一大樂趣。", "我覺得劇情很有趣，一個畫面你看得到隊友的畫面看他犯蠢😂😂😂 越後面越精彩！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222700/header.jpg", "https://store.steampowered.com/app/1222700/"),
                (620, "Portal 2", "極致經典的傳送門解謎遊戲！除了精彩的單人戰役，雙人合作模式更是考驗你們的空間感與默契，小心不要把朋友傳送到岩漿裡。", "Portal 非常經典，雖然畫風比較硬但整體呵勝！解謎成功超有快感的啦！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/header.jpg", "https://store.steampowered.com/app/620/"),
                (865360, "We Were Here Together", "探索冰冷荒原時，不幸再次降臨我們。你們必須分隔兩地，僅能透過對講機溝通來解決各式各樣的謎題，考驗的不只是智商更是表達能力！", "這系列非常推！透過無線電溝通超有代入感，有時候聽不懂隊友在講什麼也是一種樂趣😂", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/865360/header.jpg", "https://store.steampowered.com/app/865360/"),
                (1607680, "Bread & Fred", "與好友合作挑戰極限，兩隻被繩子綁在一起的小企鵝需要完美配合才能登上雪山之巔。只要一人失誤，兩人都會滾回山腳下！", "雙人的企鵝爬山，超難超講究合作！每次快爬到又摔下來真的很崩潰，但成功上去成就感爆棚！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1607680/header.jpg", "https://store.steampowered.com/app/1607680/"),
                (1217060, "槍火重生", "《槍火重生》是一款融合了第一人稱射擊、Roguelite隨機要素和RPG策略的冒險闖關遊戲。使用隨機掉落的武器闖關，最多支援四人組隊。", "有玩FPS的玩家會滿好上手。個人覺得基本角色就滿好玩的了，打擊感很爽快！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1217060/dfbc521f0f5580cc6f4ae0efc274f9069957b536/header_tchinese.jpg", "https://store.steampowered.com/app/1217060/"),
                (809880, "Degrees of Separation", "一款 2D 平臺解謎遊戲。燼和霜兩人必須運用他們冷與熱的迴異能力，一起克服重重阻礙。畫面非常唯美且解謎設計精妙。", "雙影奇境真的大推！玩過後胃口會被養大，機制設計得很棒，互動感極佳！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/809880/header.jpg", "https://store.steampowered.com/app/809880/")
            ]
        },
        {
            "id": "survival-sim",
            "category": "Survival & Sim",
            "date": "MAR 25, 2026",
            "title": "🌾 生存建造與模擬經營 (Survival, Crafting & Sim)",
            "description": "找個週末把自己關在房間裡，和朋友一起挖礦、種田、打怪，享受屬於你們的精神時光屋！",
            "heroImage": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg",
            "games": [
                (105600, "Terraria", "挖掘，戰鬥，探索，建造！在這款充滿動感的 2D 冒險遊戲中，沒有什麼是不可能的。與朋友一起擊敗強大首領，建立宏偉的堡壘吧！", "經典神作農場遊戲，對DORA型玩家友好，雖然有時會連線卡卡但瑕不掩瑜！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg", "https://store.steampowered.com/app/105600/"),
                (322330, "饑荒聯機版 (Don't Starve Together)", "《饑荒聯機版》是原生態生存遊戲的獨立多人資料片。你們必須合作收集資源、面對荒野的怪物與惡劣的環境，盡可能活得越久越好。", "一群人玩真的很有趣，要互相分工才不會餓死，常常發生搶食物的搞笑場面！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/322330/51e5f44e4e38ce02a985687df4fdc8feb678219b/header.jpg", "https://store.steampowered.com/app/322330/"),
                (413150, "Stardew Valley", "你繼承了星露谷的舊農場。帶著生鏽的工具和幾枚硬幣，你準備開始新的生活。與朋友同經營農場，體驗日出而作的悠閒生活。", "這真的是精神時光屋，要小心假日不知不覺就不見了⚠️ 大家一起種田釣魚超讚。", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg", "https://store.steampowered.com/app/413150/"),
                (1326470, "Sons Of The Forest", "你被派到了一座孤島上尋找失蹤富翁，卻發現那是座由食人族佔領的煉獄。你需要鍛造武器、建築棲身之所，並努力生存下去。", "多人恐怖休閒有劇情，陰森之子蓋房子的系統太好玩了，每天都在想要怎麼蓋最堅固的堡壘！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1326470/header.jpg", "https://store.steampowered.com/app/1326470/"),
                (2709570, "Supermarket Together", "多人超市經營遊戲已免費抵達！解鎖福利、補貨上架，或者僱用員工對付扒手。看看你們能不能把一家破小店開成大型超市！", "免費而且很耐玩，最喜歡體驗那種『下班了還要跟朋友線上一起上班』的感覺😂", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2709570/header.jpg", "https://store.steampowered.com/app/2709570/")
            ]
        },
        {
            "id": "horror-strategy",
            "category": "Horror & Strategy",
            "date": "MAR 25, 2026",
            "title": "👻 驚悚恐怖與硬派挑戰 (Horror, Strategy & Hardcore)",
            "description": "心跳加速的恐怖連線體驗與無情的硬派遊戲，測試你們的膽量與策略吧。",
            "heroImage": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1961460/header.jpg",
            "games": [
                (1961460, "PROJECT: PLAYTIME", "免費的非對稱多人恐怖遊戲，六名玩家試圖製作一個巨大的玩具並生存下去，而第七名玩家則控制怪物追殺所有人。", "多人的微恐擔當，當怪物抓朋友的時候超紓壓，被追的時候真的會尖叫！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1961460/header.jpg", "https://store.steampowered.com/app/1961460/"),
                (1302240, "Labyrinthine (怪奇迷宮)", "與1-8名玩家合作的恐怖遊戲。你們將在黑暗的迷宮中解開謎題收集物品，並躲避隱藏在陰影中的恐怖怪物。", "一定要多一點人玩，因為蠻難的！大家在迷宮裡亂竄鬼叫的過程真的超好笑👍", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1302240/header.jpg", "https://store.steampowered.com/app/1302240/"),
                (3064370, "Dark Hours: Prologue", "這是一部 1-4 人合作求生的免費恐怖遊戲序章。玩家扮演竊賊，卻在行竊時被迫與超自然怪物困在同棟建築物中！", "可以先玩demo再考慮要不要買本傳，氛圍做得很棒，當小偷還遇到鬼有夠倒楣的~", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3064370/header.jpg", "https://store.steampowered.com/app/3064370/"),
                (774861, "Project Winter", "8名玩家的生存與社交欺騙遊戲。團隊合作是度過嚴冬的關鍵，但我們之中有背叛者在伺機而動，隨時準備終結你們的性命。", "這款超好玩！可以共贏也可以陷害隊友，互相猜忌的過程超級心機，大推！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/774861/6f25285a73c7aa9c652ee701f8080dca790c1961/header.jpg", "https://store.steampowered.com/app/774861/"),
                (563560, "Alien Swarm: Reactive Drop", "一款免費的上帝視角合作射擊遊戲。在面對兇猛的外星蟲群下，你們小隊必須運用各種混合戰術完成任務目標。", "免費就很佛心了，玩法跟視角很特別，不是普通吃雞那種，打蟲子爽快感十足！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/563560/header.jpg", "https://store.steampowered.com/app/563560/"),
                (268910, "Cuphead", "《茶杯頭》是一款經典的手繪風格動作射擊遊戲，強調Boss戰。高質感的復古動畫背後，隱藏著極高的挑戰難度！", "硬派玩家必推CUPHEAD，雙人玩不會變簡單反而會互相干擾，但打贏Boss那刻超感動！", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/268910/header.jpg", "https://store.steampowered.com/app/268910/"),
                (527230, "For The King", "結合桌遊和 Roguelike 元素的跨領域戰略型 RPG。你們將踏上拯救國王的困難旅程，每一步都需要謹慎考慮與團隊決策。", "簡單好上手但需要大量策略！不過一局的時間滿長，有時候玩到深夜會不小心睡著😂", "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/527230/fef80e71ffbd88ad06d35e5f34b770fef05670b4/header_alt_assets_14_tchinese.jpg", "https://store.steampowered.com/app/527230/")
            ]
        }
    ]

    cursor = conn.cursor()

    for cat in categories_data:
        cursor.execute('''
        INSERT INTO categories (id, category, date, title, description, hero_image)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (cat["id"], cat["category"], cat["date"], cat["title"], cat["description"], cat["heroImage"]))

        for g in cat["games"]:
            appid, title, desc, threads_comment, image_url, steam_url = g
            cursor.execute('''
            INSERT OR IGNORE INTO games (appid, title, description_zh, image_url, steam_url)
            VALUES (?, ?, ?, ?, ?)
            ''', (appid, title, desc, image_url, steam_url))

            cursor.execute('''
            INSERT INTO recommendations (category_id, game_appid, threads_comment)
            VALUES (?, ?, ?)
            ''', (cat["id"], appid, threads_comment))

    conn.commit()
    print("Database seeded completely.")

if __name__ == '__main__':
    conn = init_db()
    seed_data(conn)
    conn.close()
