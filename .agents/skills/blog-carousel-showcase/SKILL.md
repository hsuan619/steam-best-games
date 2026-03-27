---
name: blog-carousel-showcase
description: 優化 blog 首頁展示區塊，將「All Threads Community Curations」改造成左右橫向可滑動的遊戲主題櫥窗（carousel / showcase strip），自動消費 articles.ts 資料，文章增加時自動延展。
---

# Blog Carousel Showcase 實作指南

## Skill 目標
將 Blog 頁面中的「All Threads Community Curations」垂直清單，改造成現代化的**橫向主題文章展示櫥窗**，支援拖曳滑動、按鈕切換、兩側漸層遮罩，並與 `build_blog_by_threads` 及 `publish_blog_by_theme` 的資料輸出完全相容。

## 模組職責分離

1. **`useCarouselScroll.ts` (行為層)**
   - 管理 scroll 容器的 ref
   - 計算是否可繼續往左 / 右滾動 (`canScrollLeft`, `canScrollRight`)
   - 提供 `scrollBy(direction)` 按鈕觸發滾動
   - 提供 `onMouseDown` 實現拖曳滑動

2. **`ThreadsCurationsCard.tsx` (卡片 UI 層)**
   - 單一文章卡片
   - 顯示封面圖、類別標籤、標題、描述、日期
   - hover 放大 / 提升陰影 / 底部 Read more 箭頭出現動畫

3. **`ThreadsCurationsCarousel.tsx` (容器 UI 層)**
   - 接收完整 `articles` 陣列 → 自動渲染全部卡片
   - 控制遮罩顯示（左右邊界）
   - 渲染導航按鈕（左右箭頭）
   - scroll 事件觸發按鈕 enable/disable 更新

## 整合到 Blog 頁面

只需在 `src/pages/Blog.tsx` 中替換原本的垂直清單區塊：

```diff
-import { useState } from 'react';
+import { ThreadsCurationsCarousel } from '../components/ui/ThreadsCurationsCarousel';

// 移除 visibleCount state & handleLoadMore
// 移除 xl:col-span-8 section 的垂直列表

+<ThreadsCurationsCarousel articles={articles} />
```

## 為何文章增加時自動延展

`ThreadsCurationsCarousel` 使用 `flex gap-5 overflow-x-auto` 的 flex 容器。  
卡片使用 `flex-shrink-0 w-72` — 固定寬度但不壓縮。  
當 `articles.ts` 新增文章 → `articles.map(...)` 自動渲染更多卡片 → flex 容器橫向自動撐開 → scrollbar 自動可用。  
**完全無需人工調整版面。**

## 與 build_blog_by_threads & publish_blog_by_theme 相容

`ThreadsCurationsCarousel` 只依賴 `Article` 介面中的以下欄位：
- `id` — URL slug
- `category` — 標籤
- `date` — 日期
- `title` — 標題
- `description` — 描述（可 line-clamp）
- `heroImage` — 封面圖

這些欄位在 `publish_blog_by_theme` append 的每一篇文章中均已存在，**無需修改現有資料結構**。

## 需要安裝的套件

無需新增任何套件。本 Skill 僅使用：
- React + TypeScript（已有）
- Tailwind CSS（已有）
- react-router-dom Link（已有）
- `no-scrollbar` CSS 工具類（已在 `src/index.css` 中定義）
