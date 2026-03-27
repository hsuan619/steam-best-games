import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TopNavBar } from './components/TopNavBar';
import { Blog } from './pages/Blog';
import { ArticleDetail } from './pages/ArticleDetail';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1c2029',
            color: '#eff0fa',
            border: '1px solid rgba(86, 101, 142, 0.2)',
          },
        }} />
        <TopNavBar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Blog />} />
            <Route path="/:id" element={<ArticleDetail />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
}
