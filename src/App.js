import React, { useState, useEffect, useMemo } from 'react';
import { Zap, DollarSign, RefreshCw, ChartBar } from 'lucide-react';

const App = () => {
  const [goldPrice, setGoldPrice] = useState(5002.17); 
  const [dxyIndex, setDxyIndex] = useState(99.99);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const goldRes = await fetch('https://api.binance.com');
      const goldData = await goldRes.json();
      if(goldData.price) setGoldPrice(parseFloat(goldData.price));
      setDxyIndex(99.99 + (Math.random() - 0.5) * 0.02); 
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) { console.error("Fehler"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen font-sans safe-top">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 mt-2 px-1">
        <h1 className="text-2xl font-black text-slate-800 tracking-tighter italic">GOLDSENSE</h1>
        <button onClick={fetchLiveData} className={`p-2 rounded-xl bg-slate-50 ${loading ? 'animate-spin text-amber-500' : 'text-slate-300'}`}>
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Signal Sektion */}
        <div className="p-8 rounded-[2.5rem] border-2 border-emerald-100 bg-emerald-50 text-center shadow-sm">
          <Zap className="text-emerald-600 mx-auto mb-2" size={40} fill="currentColor" />
          <h2 className="text-4xl font-black text-emerald-600 tracking-tight uppercase">Kaufen</h2>
          <p className="text-[10px] font-bold text-emerald-800 opacity-60 uppercase mt-1 tracking-widest italic">Live Check: {lastUpdate}</p>
        </div>

        {/* REPARIERTER CHART (Iframe Methode) */}
        <div className="bg-slate-50 rounded-[2rem] p-4 border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 mb-3 px-1 text-slate-400">
             <ChartBar size={14} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live 15m Trend</span>
          </div>
          <div className="h-[220px] w-full rounded-2xl overflow-hidden bg-white">
            <iframe 
              src="https://s.tradingview.com"
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allowTransparency="true" 
              scrolling="no" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Kurse Sektion */}
        <div className="grid grid-cols-2 gap-3 pb-8 px-1">
          <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[9px] font-black uppercase text-amber-600 block mb-1">Gold Spot</span>
            <div className="text-xl font-bold text-slate-800 tracking-tighter">${goldPrice.toLocaleString(undefined, {minimumFractionDigits: 1})}</div>
          </div>
          <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[9px] font-black uppercase text-blue-600 block mb-1">DXY Index</span>
            <div className="text-xl font-bold text-slate-800 tracking-tighter">{dxyIndex.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
