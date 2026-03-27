import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0e15] dark:bg-[#0b0e15] border-t border-[#161a22] mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 gap-6 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold text-[#eff0fa] font-headline">四隻鳥的SEO作業</span>
          <p className="font-['Inter'] text-xs text-[#a9abb4] max-w-xs">歡迎找我們打遊戲</p>
        </div>
        {/* <div className="flex flex-wrap justify-center gap-8">
          <a className="font-['Inter'] text-xs text-[#a9abb4] hover:text-[#eff0fa] transition-colors duration-200 opacity-80 hover:opacity-100" href="#">About Us</a>
          <a className="font-['Inter'] text-xs text-[#a9abb4] hover:text-[#eff0fa] transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="font-['Inter'] text-xs text-[#a9abb4] hover:text-[#eff0fa] transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="font-['Inter'] text-xs text-[#a9abb4] hover:text-[#eff0fa] transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Support</a>
          <a className="font-['Inter'] text-xs text-[#a9abb4] hover:text-[#eff0fa] transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Careers</a>
        </div> */}
        <div className="flex flex-col items-end gap-4">
          {/* <div className="flex gap-4">
            <span className="material-symbols-outlined text-[#a9abb4] hover:text-[#71caff] cursor-pointer">share</span>
            <span className="material-symbols-outlined text-[#a9abb4] hover:text-[#71caff] cursor-pointer">public</span>
            <span className="material-symbols-outlined text-[#a9abb4] hover:text-[#71caff] cursor-pointer">mail</span>
          </div> */}
          <p className="font-['Inter'] text-xs text-[#a9abb4]">© 2026 四隻鳥的SEO作業. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
