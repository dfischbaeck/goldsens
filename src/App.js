import React, { useState, useEffect, useMemo } from 'react';
import { Zap, DollarSign, RefreshCw, Activity } from 'lucide-react';

const App = () => {
  // DEINEN SCHLÜSSEL HIER EINTRAGEN:
  const API_KEY = goldapi-bg1419mmtox29w-io; 

  const [goldPrice, setGoldPrice] = useState(0);
  const [dxyIndex, setDxyIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('signals');

  const fetchLiveData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Live Goldpreis laden
      const goldRes = await fetch("https://www.goldapi.io", {
        headers: { "x-access-token": API_KEY }
      });
      const goldData = await goldRes.json();
      
      // 2. Live Dollar-Index (DXY) laden
      const dxyRes = await fetch("https://www.goldapi.io", {
        headers: { "x-access-token": API_KEY }
      });
      const dxyData = await dxyRes.json();

      if (goldData.price) setGoldPrice(goldData.price);
      if (dxyData.price) setDxyIndex(dxyData.price);
      
    } catch (err) {
      setError("API-Limit erreicht oder Key falsch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 300000); // Alle 5 Min aktualisieren
    return () => clearInterval(interval);
  }, []);

  const analysis = useMemo(() => {
    if (!goldPrice || !dxyIndex) return null;
    
    let score = 0;
    // Gold/DXY Korrelation: DXY runter -> Gold hoch
    if (dxyIndex < 101.5) score += 2;
    if (dxyIndex > 103.5) score -= 2;

    let signal = { type: 'NEUTRAL', color: 'text-slate-500', bg: 'bg-slate-50' };
    if (score >= 2) signal = { type: 'STRONG BUY', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score <= -2) signal = { type: 'SELL', color: 'text-red-600', bg: 'bg-red-50' };

    return signal;
  }, [goldPrice, dxyIndex]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <div className="bg-amber-500 p-1.5 rounded-lg text-white"><DollarSign size={20}/></div>
          GoldSense Live
        </h1>
        <button onClick={fetchLiveData} className={`${loading ? 'animate-spin' : ''}`}>
          <RefreshCw size={20} className="text-slate-400" />
        </button>
      </div>

      {error && <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold">{error}</div>}

      <div className="space-y-4">
        {analysis && (
          <div className={`p-10 rounded-[2.5rem] border-2 ${analysis.bg} text-center`}>
            <Zap className={`${analysis.color} mx-auto mb-4`} size={48} fill="currentColor" />
            <h2 className={`text-5xl font-black ${analysis.color}`}>{analysis.type}</h2>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-slate-50 rounded-[2rem] border">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">XAU/USD (Live)</p>
            <p className="text-2xl font-bold">${goldPrice.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-[2rem] border">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">DXY Index</p>
            <p className="text-2xl font-bold">{dxyIndex.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
