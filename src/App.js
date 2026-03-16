import React, { useState, useEffect, useMemo } from 'react';
import { Zap, BarChart3, Wifi, WifiOff } from 'lucide-react';

const App = () => {
  // Startwerte für den 17. März 2026
  const [goldPrice, setGoldPrice] = useState(5012.15);
  const [dxyIndex, setDxyIndex] = useState(99.82);
  const [isOnline, setIsOnline] = useState(false);
  const [priceFlash, setPriceFlash] = useState(null);

  useEffect(() => {
    let ws;
    try {
      // Verbindung zum Binance High-Speed Stream
      ws = new WebSocket('wss://://stream.binance.com');

      ws.onopen = () => setIsOnline(true);
      ws.onclose = () => setIsOnline(false);
      ws.onerror = () => setIsOnline(false);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data && data.c) {
          const newPrice = parseFloat(data.c);
          setGoldPrice(prev => {
            if (newPrice > prev) setPriceFlash('up');
            else if (newPrice < prev) setPriceFlash('down');
            setTimeout(() => setPriceFlash(null), 300);
            return newPrice;
          });
          // DXY Simulation
          setDxyIndex(99.82 + (Math.random() - 0.5) * 0.02);
        }
      };
    } catch (e) {
      console.error("Connection failed");
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const signal = useMemo(() => {
    if (dxyIndex < 100) return { type: 'STRONG BUY', color: '#00FF00', bg: 'rgba(0, 255, 0, 0.1)' };
    return { type: 'NEUTRAL', color: '#888', bg: 'transparent' };
  }, [dxyIndex]);

  return (
    <div className="bg-[#0b0e11] text-[#d1d4dc] min-h-screen font-mono p-4 select-none" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-[#00FF00]" />
          <span className="text-[10px] font-bold uppercase text-[#00FF00]">XAUUSD Live Ticker</span>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi size={12} className="text-[#00FF00] animate-pulse" /> : <WifiOff size={12} className="text-red-500" />}
          <span className="text-[9px] font-bold tracking-tighter uppercase">{isOnline ? 'Live' : 'Syncing...'}</span>
        </div>
      </div>

      {/* Preis-Kacheln */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className={`p-4 rounded border transition-all duration-200 ${priceFlash === 'up' ? 'bg-[#003300] border-[#00FF00]' : priceFlash === 'down' ? 'bg-[#330000] border-[#FF0000]' : 'bg-[#131722] border-[#2a2e39]'}`}>
          <div className="text-[#888] text-[9px] mb-1 uppercase font-bold tracking-widest text-center">Gold (Tick)</div>
          <div className="text-xl font-black text-center text-[#00FF00]">
            ${goldPrice.toFixed(2)}
          </div>
        </div>
        <div className="bg-[#131722] p-4 rounded border border-[#2a2e39]">
          <div className="text-[#888] text-[9px] mb-1 uppercase font-bold tracking-widest text-center">DXY Proxy</div>
          <div className="text-xl text-white font-black text-center tracking-tighter">{dxyIndex.toFixed(2)}</div>
        </div>
      </div>

      {/* Signal */}
      <div className="p-8 rounded border-2 mb-4 text-center transition-all duration-500" style={{borderColor: signal.color, backgroundColor: signal.bg}}>
        <Zap className="mx-auto mb-2" size={32} style={{color: signal.color}} fill="currentColor" />
        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-center" style={{color: signal.color}}>{signal.type}</h2>
      </div>

      {/* Chart */}
      <div className="bg-[#131722] rounded border border-[#2a2e39] h-[300px] overflow-hidden relative shadow-2xl">
        <iframe 
          src="https://s.tradingview.com"
          width="100%" height="100%" frameBorder="0" allowTransparency="true" scrolling="no" 
        ></iframe>
      </div>
    </div>
  );
};

export default App;
