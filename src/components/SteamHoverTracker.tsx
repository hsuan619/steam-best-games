import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SteamSaleService } from '../services/SteamSaleService';
import { SteamSaleData, SteamHoverTrackerProps } from '../types';

export const SteamHoverTracker: React.FC<SteamHoverTrackerProps> = ({ appId, imageUrl, title }) => {
  const [data, setData] = useState<SteamSaleData | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!title && !appId) return;
    if (!isHovered || hasFetched.current) return;
    
    hasFetched.current = true;

    let isMounted = true;
    const fetchData = async () => {
      try {
        let targetAppId = appId;
        if (!targetAppId && title) {
          const resolved = await SteamSaleService.resolveAppId(title);
          if (resolved) targetAppId = resolved;
        }

        if (!targetAppId) return;

        const history = await SteamSaleService.fetchPriceHistory(targetAppId, (freshHistory) => {
          if (!isMounted) return;
          if (freshHistory.length === 0) return;
          const freshLastPoint = freshHistory[freshHistory.length - 1];
          const freshBasePrice = Math.round(freshLastPoint.price / (1 - freshLastPoint.discountPercent / 100));
          const freshAnalysis = SteamSaleService.analyzePriceTrend(freshHistory, freshLastPoint.price, freshBasePrice);
          if (freshAnalysis && freshAnalysis.history.length > 0) {
            setData(freshAnalysis);
          }
        });

        if (history.length === 0) return;
        
        const lastPoint = history[history.length - 1];
        const basePrice = Math.round(lastPoint.price / (1 - lastPoint.discountPercent / 100));
        
        const analysis = SteamSaleService.analyzePriceTrend(history, lastPoint.price, basePrice);
        
        if (isMounted && analysis && analysis.history.length > 0) {
          setData(analysis);
        }
      } catch (err) {
        console.error('SteamHoverTracker Error:', err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [appId, title, isHovered]); // Re-fetch gracefully if appId changes and hovered

  const hasData = !!data;

  const formatXAxisDate = (tickItem: string) => {
    const parts = tickItem.split('-');
    if (parts.length >= 2) return `${parts[0].slice(2)}/${parts[1]}`;
    return tickItem;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-[#151921]/95 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg shadow-2xl text-white transform transition-all z-50">
          <div className="flex items-center gap-1.5 mb-1.5 align-baseline">
            <p className="font-bold text-white/50 text-[10px] tracking-widest uppercase">{dataPoint.date}</p>
            {dataPoint.eventName && <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-1.5 py-[2px] rounded uppercase">{dataPoint.eventName}</span>}
          </div>
          <div className="flex items-center gap-2">
             <p className="text-sm font-black text-green-400">NT${dataPoint.price}</p>
             {dataPoint.discountPercent > 0 && <p className="text-[10px] font-bold text-green-400 bg-green-400/20 px-1.5 py-0.5 rounded">-{dataPoint.discountPercent}%</p>}
          </div>
        </div>
      );
    }
    return null;
  };

  const getStyleClasses = () => {
    if (!data) return { boxClass: '', iconName: '' };
    const isLow = data.isCurrentHistoricalLow;
    const currentDiscount = data.history[data.history.length - 1].discountPercent;
    const isSale = currentDiscount > 0;
    
    if (isLow) return { boxClass: 'bg-yellow-900/30 border-yellow-700/50 text-yellow-500', iconName: 'local_offer' };
    if (isSale) return { boxClass: 'bg-green-900/30 border-green-700/50 text-green-400', iconName: 'local_offer' };
    return { boxClass: 'bg-white/5 border-white/10 text-white/50', iconName: 'hourglass_bottom' };
  };

  const { boxClass, iconName } = getStyleClasses();

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-[#0A0F16] group/tracker cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        className={`w-full h-full object-cover transition-all duration-700 opacity-90 group-hover/tracker:opacity-100 ${isHovered ? 'scale-100 blur-[2px] brightness-50' : 'group-hover/tracker:scale-105'}`} 
        src={imageUrl} 
        alt={title}
      />
      
      {/* Fake Play Button - subtle overlay until hovered */}
      <div className={`absolute inset-0 bg-gradient-to-t from-[#0A0F16]/80 via-transparent to-transparent flex flex-col justify-center items-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-0 group-hover/tracker:opacity-100'}`}>
        <div className="w-16 h-16 rounded-full bg-blue-500/90 flex items-center justify-center backdrop-blur-md scale-90 group-hover/tracker:scale-100 transition-transform shadow-xl shadow-blue-500/20">
          <span className="material-symbols-outlined text-white text-3xl drop-shadow" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        </div>
      </div>

      {/* Hover Overlay Tracker Widget */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-end p-8 backdrop-blur-[1px]"
          >
            {/* The exact panel container matching the image */}
            <div className="bg-[#151921]/95 text-white border border-white/5 rounded-2xl p-6 shadow-2xl w-full max-w-[340px] transform transition-all group-hover/tracker:-translate-x-2">
              
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-blue-400 text-[20px] font-light">trending_up</span>
                <span className="text-[11px] font-bold tracking-[0.15em] text-slate-300 uppercase mt-0.5">Steam 價格趨勢</span>
              </div>
              
              {/* Price Row */}
              <div className="flex items-center gap-3 mb-5">
                {data && data.history[data.history.length - 1].discountPercent > 0 && (
                  <span className="border border-green-500/40 text-green-400 bg-green-500/10 px-2 py-0.5 rounded text-sm font-bold tracking-wider">
                    -{data.history[data.history.length - 1].discountPercent}%
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold mr-1 text-white/50">
                    {!data ? '無法取得價格' : 
                     data.currentPrice === 0 ? '免費' : 
                     data.history[data.history.length - 1].discountPercent > 0 ? '特別促銷 NT$' : 
                     '一般版本 NT$'}
                  </span>
                  <span className="text-[40px] font-black text-white leading-none tracking-tight">
                    {data ? (data.currentPrice === 0 ? '0' : data.currentPrice) : '--'}
                  </span>
                </div>
              </div>

              {/* Recommendation Pill */}
              <div className={`border rounded-lg px-4 py-3 flex items-center gap-2.5 ${boxClass}`}>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{iconName || 'error_outline'}</span>
                <span className="text-[13px] font-bold tracking-wide">
                  {data ? data.recommendation : '讀取失敗或受限制，請稍候重試或至 Steam 查詢。'}
                </span>
              </div>

              {/* Chart */}
              <div className="mt-8 h-[75px] w-full relative">
                {data ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.history} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatXAxisDate} 
                        stroke="#ffffff30" 
                        fontSize={10}
                        fontWeight={600}
                        tickMargin={12}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={20}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '4 4', fill: 'transparent' }} />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#151921', stroke: '#10b981', strokeWidth: 2.5 }} 
                        activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                    <span className="material-symbols-outlined text-sm mb-1 opacity-50">query_stats</span>
                    <span className="text-[9px] tracking-widest uppercase opacity-50">No trend data available</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
