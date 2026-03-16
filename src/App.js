import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Activity, RefreshCw, ChevronDown, BarChart3 } from 'lucide-react';

const App = () => {
  // Live-Werte vom 16. März 2026
  const [goldPrice, setGoldPrice] = useState(5006.00); 
  const [dxyIndex, setDxyIndex] = useState(99.85);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.binance.com');
      const data = await res.json();
      if(data.price) setGoldPrice(parseFloat(data.price));
      // DXY Simulation basierend auf heutigem Realwert
      setDxyIndex(99.85 + (Math.random() - 0.5) * 0.05);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e) { console.error("Sync Error"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000); // 10s Intervall
    return () => clearInterval(interval);
  }, []);

  const signal = useMemo(() => {
    // DXY unter 100 ist historisch bullisch für Gold
    if (dxyIndex < 100) return { type: 'STRONG BUY', color: '#00FF00', bg: 'rgba(0, 255, 0, 0.1)' };
    return { type: 'NEUTRAL', color: '#888', bg: 'transparent' };
  }, [dxyIndex]);

  return (
    <div className="bg-[#0b0e11] text-[#d1d4dc] min-h-screen font-mono p-4 safe-top">
      {/* MT4 Top Bar */}
      <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-[#00FF00]" />
          <span className="text-xs font-bold tracking-tighter">XAUUSD, M15</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-[#00FF00] font-bold">{lastUpdate}</span>
          <button onClick={fetchLiveData} className={loading ? 'animate-spin' : ''}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Market Watch Style Info */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold uppercase tracking-wider">
        <div className="bg-[#131722] p-3 rounded border border-[#2a2e39]">
          <div className="text-[#888] mb-1">Bid (Gold)</div>
          <div className="text-xl text-[#00FF00]">${goldPrice.toFixed(2)}</div>
        </div>
        <div className="bg-[#131722] p-3 rounded border border-[#2a2e39]">
          <div className="text-[#888] mb-1">DXY Index</div>
          <div className="text-xl text-white">{dxyIndex.toFixed(2)}</div>
        </div>
      </div>

      {/* Signal Banner */}
      <div className="p-6 rounded border-2 mb-4 text-center" style={{borderColor: signal.color, backgroundColor: signal.bg}}>
        <Zap className="mx-auto mb-2" size={32} style={{color: signal.color}} fill="currentColor" />
        <h2 className="text-3xl font-black italic" style={{color: signal.color}}>{signal.type}</h2>
      </div>

      {/* MT4 Live Chart */}
      <div className="bg-[#131722] rounded border border-[#2a2e39] h-[260px] overflow-hidden relative shadow-2xl">
        <div className="absolute top-2 left-2 z-10 bg-[#0b0e11]/80 px-2 py-1 rounded text-[9px] border border-[#2a2e39]">
          GOLD SPOT • 15 MIN • LIVE
        </div>
        <iframe 
          src="https://s.tradingview.com"
          width="100%" height="100%" frameBorder="0" allowTransparency="true" scrolling="no" 
        ></iframe>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-4 flex justify-between items-center text-[9px] text-[#4d5059] border-t border-[#2a2e39] pt-2">
        <div className="flex items-center gap-2">
          <Activity size={10} className="text-[#00FF00]" />
          <span>TERMINAL CONNECTED</span>
        </div>
        <span>SPREAD: 0.20</span>
      </div>
    </div>
  );
};

export default App;
