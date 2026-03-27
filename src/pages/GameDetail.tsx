import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SteamHoverTracker } from '../components/SteamHoverTracker';

export const GameDetail: React.FC = () => {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative h-[870px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUBaT5USMPSp8F0aGBZ832JlXEMFFR_sUclEpNfY-4mp39EHdwW5gVuj1Iko9kdaTDYYAUYt8uZ_Ofh6uoSkgfbDKDvlf3PYII0Ii6WFacIiLw2tLTi43x0TWtz6-hFo7v0FGh__Bryt1-hTasAdNEiLbpvdlF445C9_XJP0IvqMu8Krpr__KE3Er9vz3mckXYmi8fgfXBh4AubuCJL0H3y-8QhsEPvG9BotAtS1_5PqN0czVvdd83DsemQ7JxF2qqv2FQG6fOVguE')" }}></div>
        <div className="absolute inset-0 hero-gradient bg-gradient-to-b from-transparent to-[#0b0e15]"></div>
        <div className="relative h-full max-w-screen-2xl mx-auto px-8 flex flex-col justify-end pb-16 pt-24">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">3+ Players Recommended</span>
            <span className="bg-surface-bright/50 backdrop-blur-md text-on-surface px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Co-op Adventure</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter mb-4 leading-none">NEON ALLIANCE</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg mb-8 font-light leading-relaxed">Assemble your squad in the definitive tactical co-op experience. Navigate the underbelly of New Aetheria where every decision demands synchronization and precision.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => toast.success('Game session starting...')} className="primary-gradient text-on-primary font-bold px-10 py-4 rounded-xl flex items-center gap-3 scale-100 hover:scale-105 active:scale-95 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              Get Started
            </button>
            <button onClick={() => toast.success('Added to your library! ✓')} className="bg-surface-container-highest text-on-surface font-bold px-10 py-4 rounded-xl flex items-center gap-3 hover:bg-surface-bright transition-colors active:scale-95">
              <span className="material-symbols-outlined">add</span>
              Add to Library
            </button>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="max-w-screen-2xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Discovery & Media */}
        <div className="lg:col-span-8 space-y-20">
          {/* Social Gameplay Clips */}
          <section>
            <h2 className="font-headline text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="text-primary material-symbols-outlined">videocam</span>
              Social Moments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative aspect-video rounded-xl overflow-hidden bg-surface-container shadow-2xl">
                <div className="absolute inset-0 w-full h-full">
                  <SteamHoverTracker title="NEON ALLIANCE" imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBy9GsorLK1jn0QaCEainIdrPAWaQTLfZBDyKHfWPQeafqRF2vxG6ad9x7zn9fs07NNsjsRWq1PA5oBpEU5HDouclhgXK97SrnHCSLpPMpWb65a9nipdg5Zk40N9TS9Qm_rl-SWDolFXpDWH67ntRdVb4ofKvmxBjFvPIwI-zXpW8o6rI52mOHeWlzoXCxEhdKgfNSrANTF0UQyyDkTXs4ZAqv4cFzuSz4R2F_DTXbZUst8IYa_fPU5WukoawpfwMG8DIY6yR5rlXFm" />
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="material-symbols-outlined text-white text-6xl">play_circle</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-sm font-bold bg-black/60 backdrop-blur-sm px-2 py-1 rounded">Sync Kill Achievement</p>
                </div>
              </div>
              <div className="group relative aspect-video rounded-xl overflow-hidden bg-surface-container shadow-2xl">
                <div className="absolute inset-0 w-full h-full">
                  <SteamHoverTracker title="NEON ALLIANCE" imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDfTt9GeVPKf48CtjBfjZsxUH4_JP3be4UUBdg74m-pr8ZBlCozp-Bh-lJXylDVthb1cz83Bc5L2GMZkw8ZZmhHZSWkTcq71SyueSCQ6HCp77LdvfmY8InjZ3s-eGyEyoTpt334f8JsJaaRdb3VEzv8XnQoxH29Fl9edcLS4iR8Pzy8x0XzASUpyIcga-33t1QYGA8WbICKKjNqVRNA0XyCmMZhV7OCg1P8S-ulY2U1aTn_b9L5RuTu2pAkx43GyEpuJ81sg1CPA6bB" />
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="material-symbols-outlined text-white text-6xl">play_circle</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-sm font-bold bg-black/60 backdrop-blur-sm px-2 py-1 rounded">Base Customization</p>
                </div>
              </div>
            </div>
          </section>

          {/* Reasons to Play Together (Bento Style) */}
          <section>
            <h2 className="font-headline text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="text-primary material-symbols-outlined">groups</span>
              Why Play Together?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 h-[500px]">
              <div className="md:col-span-2 bg-surface-container rounded-xl p-8 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <span className="material-symbols-outlined text-primary text-6xl opacity-20">handshake</span>
                </div>
                <h3 className="font-headline text-2xl font-bold mb-2">Deep Teamwork</h3>
                <p className="text-on-surface-variant">Coordinate special abilities that trigger massive combo effects. Success isn't about solo skill, it's about the unit.</p>
              </div>
              <div className="bg-surface-bright rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-4">speed</span>
                <h3 className="font-headline text-xl font-bold mb-2">Easy Entry</h3>
                <p className="text-sm text-on-surface-variant">Jump-in mechanics allow friends to join mid-session without level penalties.</p>
              </div>
              <div className="bg-secondary-container rounded-xl p-8 flex items-center gap-6">
                <span className="material-symbols-outlined text-4xl text-on-secondary-container">forum</span>
                <div>
                  <h3 className="font-headline text-xl font-bold">Integrated Comms</h3>
                  <p className="text-xs text-on-secondary-container/80">Spatial audio and smart-ping systems.</p>
                </div>
              </div>
              <div className="md:col-span-2 bg-surface-container-high rounded-xl p-8 flex flex-col justify-center">
                <div className="flex gap-4 mb-4">
                  <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-mono">MODULAR_LOOT</span>
                  <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-mono">SHARED_XP</span>
                </div>
                <h3 className="font-headline text-2xl font-bold mb-2">Shared Progression</h3>
                <p className="text-on-surface-variant">Every victory rewards the whole group equally. No more fighting over the best drops.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Community & Social Stats */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Recommended Badge Card */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Curator Rating</p>
                <p className="font-headline text-xl font-black">ESSENTIAL PLAY</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Team Synergy</span>
                <span className="text-primary font-bold">9.8/10</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full w-[98%]"></div>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-on-surface-variant">Replayability</span>
                <span className="text-primary font-bold">9.2/10</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full w-[92%]"></div>
              </div>
            </div>
          </div>

          {/* Community Recommendations */}
          <section>
            <h3 className="font-headline text-xl font-bold mb-6">Community Highlights</h3>
            <div className="space-y-4">
              <div className="bg-surface-container/60 backdrop-blur-md p-5 rounded-xl border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-3">
                  <img alt="User 1" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc1JFjAlt2RGwPtXQQfKaZR7gc7ivvrjV2ZN31VySCSei-oDQMloGMI4_taF4DvQIFRpGJBhJdDcLxzl6elsgUoSqXQnavftzHX_mHjvkwePTWIVkQi9BDDvSlg9qaSxzCFavUNckZ2r2OX5QsKvXs0UCm6Go-A0eqxwk6gUyXDpceQXiCePROOckzBJXMQmmy_hy6bp4BzociQeyT1rmaYgKhGZgAKJdDW_1KevBlDC4h70AGbhoWhTtdHGRYXdeHNDXez2MfSC-k"/>
                  <span className="text-sm font-bold">Apex_Hunter</span>
                  <span className="ml-auto text-xs text-on-surface-variant">2d ago</span>
                </div>
                <p className="text-sm text-on-surface-variant italic">"Best co-op mechanics since Portal 2. The boss fights actually require everyone to be on their toes."</p>
              </div>
              <div className="bg-surface-container/60 backdrop-blur-md p-5 rounded-xl border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-3">
                  <img alt="User 2" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKBx1bcB3NI_gZqNI2Fvz2elliuEGE_yH97V503EkQA2DewifS04QAUcybhV-sB-6QgyCZbR6MTtKrMO3dnvGigcaLOncMGOJmR3o4uCX8JvVw2ica_6cwEcFqWRR579i83LHsJo_-yqGtnmBxWezdETJ3Rb96k91k1IY9apBQlbkWPtAjSGQWfaygCpfwFskIzy2KsjwQBmAmZ5Sac-rHj34fRzQRfNWI_32hiFH9MCNWGhJ7swWMpL5s8L5PBVwFKLEgPbeaDR2D"/>
                  <span className="text-sm font-bold">CyberVixen</span>
                  <span className="ml-auto text-xs text-on-surface-variant">4d ago</span>
                </div>
                <p className="text-sm text-on-surface-variant italic">"The social hub is actually fun to hang out in between missions. 10/10 vibes."</p>
              </div>
            </div>
            <button className="w-full mt-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors">View all 1,420 reviews</button>
          </section>

          {/* Technical Specs / Badges */}
          <section className="bg-surface-container rounded-xl p-6">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Features</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-surface-container-high border border-outline-variant/20 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">cloud_done</span> Cloud Saves
              </span>
              <span className="bg-surface-container-high border border-outline-variant/20 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">devices</span> Cross-Play
              </span>
              <span className="bg-surface-container-high border border-outline-variant/20 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">headphones</span> Discord Integrated
              </span>
              <span className="bg-surface-container-high border border-outline-variant/20 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">sports_esports</span> Full Controller Support
              </span>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
};
