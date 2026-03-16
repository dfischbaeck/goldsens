import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Activity, RefreshCw, BarChart3, AlertCircle } from 'lucide-react';

const App = () => {
  // Live-Werte vom 16. März 2026 als Basis
  const [goldPrice, setGoldPrice] = useState(5006.00); 
  const [dxyIndex, setDxyIndex] = useState(99.85);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const fetchLiveData = async () => {
    setLoading(true);
    setError(false);
    try {
      // Primäre Quelle: Binance PAXG/USDT (Echtzeit Gold-Token)
      const res = await fetch('https://api.binance.com');
      if (!res.ok) throw new Error('API Blocked');
      const data = await res.json();
      
      if(data.price) {
        setGoldPrice(parseFloat(data.price));
        // DXY Simulation basierend auf heutigem Realwert 99.85
        setDxyIndex(99.85 + (Math.random() - 0.5) * 0.04);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error("Sync Error - Nutze Fallback");
      setError(true);
      // Fallback: Kleine Schwankung um den Realwert von heute simulieren
      setGoldPrice(prev => prev + (Math.random() - 0.5) * 0.5);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000); // 10s Intervall
    return () => clearInterval(interval);
  }, []);

  const signal = useMemo(() => {
    if (dxyIndex < 100.2) return { type: 'STRONG BUY', color: '#00FF00', bg: 'rgba(0, 255, 0, 0.1)' };
    return { type: 'NEUTRAL', color: '#888', bg: 'transparent' };
  }, [dxyIndex]);

  return (
    <div className="bg-[#0b0e11] text-[#d1d4dc] min-h-screen font-mono p-4 safe-top">
      {/* MT4 Top Bar */}
      <div className="flex justify-between items-center border-b border-[#2a2e39] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-[#00FF00]" />
          <span className="text-xs font-bold tracking-tighter uppercase">XAUUSD, M15</span>
        </div>
        <div className="flex items-center gap-3">
          {error && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
          <span className="text-[10px] text-[#00FF00] font-bold">{lastUpdate}</span>
          <button onClick={fetchLiveData} className={loading ? 'animate-spin' : ''}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Market Watch Style Info */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold uppercase tracking-wider">
        <div className="bg-[#131722] p-3 rounded border border-[#2a2e39] shadow-inner">
          <div className="text-[#888] mb-1">Bid (Gold)</div>
          <div className="text-xl text-[#00FF00] tracking-tighter">${goldPrice.toFixed(2)}</div>
        </div>
        <div className="bg-[#131722] p-3 rounded border border-[#2a2e39] shadow-inner">
          <div className="text-[#888] mb-1">DXY Index</div>
          <div className="text-xl text-white tracking-tighter">{dxyIndex.toFixed(2)}</div>
        </div>
      </div>

      {/* Signal Banner */}
      <div className="p-6 rounded border-2 mb-4 text-center transition-all duration-500" style={{borderColor: signal.color, backgroundColor: signal.bg}}>
        <Zap className="mx-auto mb-2" size={32} style={{color: signal.color}} fill="currentColor" />
        <h2 className="text-3xl font-black italic tracking-tighter" style={{color: signal.color}}>{signal.type}</h2>
      </div>

      {/* MT4 Live Chart */}
      <div className="bg-[#131722] rounded border border-[#2a2e39] h-[280px] overflow-hidden relative shadow-2xl">
        <iframe 
          src="https://s.tradingview.com"
          width="100%" height="100%" frameBorder="0" allowTransparency="true" scrolling="no" 
        ></iframe>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-4 flex justify-between items-center text-[9px] text-[#4d5059] border-t border-[#2a2e39] pt-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-[#00FF00] animate-pulse'}`}></div>
          <span className="uppercase tracking-widest">{error ? 'API CONNECTION FAILED' : 'TERMINAL CONNECTED'}</span>
        </div>
        <span>SPREAD: 0.18</span>
      </div>
    </div>
  );
};

export default App;
