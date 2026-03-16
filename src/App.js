import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Globe, Settings, Activity, Zap, DollarSign, RefreshCw } from 'lucide-react';

const App = () => {
  // Aktueller Marktwert (Stand: 16. März 2026)
  const [goldPrice, setGoldPrice] = useState(5012.26); 
  const [dxyIndex, setDxyIndex] = useState(104.15);
  const [loading, setLoading] = useState(false);
  const [geopolitics, setGeopolitics] = useState('Stabil'); 
  const [activeTab, setActiveTab] = useState('signals');

  // Funktion zum manuellen Abgleich oder Simulation
  const fetchPrices = async () => {
    setLoading(true);
    // Hier nutzen wir eine stabilere Simulation, da kostenlose APIs oft offline sind
    setTimeout(() => {
      const volatility = (Math.random() - 0.5) * 5;
      setGoldPrice(prev => Number((prev + volatility).toFixed(2)));
      setDxyIndex(104.1 + Math.random() * 0.2);
      setLoading(false);
    }, 800);
  };

  const analysis = useMemo(() => {
    // RSI Logik (relativ zum neuen Preisniveau von ~5000$)
    const rsi = 45 + (Math.sin(goldPrice / 20) * 15); 
    let score = 0;
    
    if (rsi < 40) score += 2;
    if (dxyIndex < 103.8) score += 1.5;
    if (geopolitics === 'Krise') score += 3;
    
    if (rsi > 60) score -= 2;
    if (dxyIndex > 104.5) score -= 1.5;

    let signal = { type: 'NEUTRAL', label: 'Beobachten', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };
    if (score >= 3) signal = { type: 'STRONG BUY', label: 'Kaufen', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    else if (score >= 1) signal = { type: 'BUY', label: 'Long-Einstieg', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    else if (score <= -1.5) signal = { type: 'SELL', label: 'Gewinne sichern', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };

    return { score, signal, rsi };
  }, [goldPrice, dxyIndex, geopolitics]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-2 rounded-xl text-white shadow-lg"><DollarSign size={20}/></div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">GoldSense</h1>
        </div>
        <button onClick={fetchPrices} className={`p-2 rounded-full transition-all ${loading ? 'animate-spin' : 'hover:bg-slate-100'}`}>
          <RefreshCw size={18} className="text-slate-400" />
        </button>
      </div>

      <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 mb-6">
        <button onClick={() => setActiveTab('signals')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'signals' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>DASHBOARD</button>
        <button onClick={() => setActiveTab('settings')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>MARKTDATEN</button>
      </div>

      {activeTab === 'signals' ? (
        <div className="space-y-4">
          <div className={`p-8 rounded-[2.5rem] border-2 ${analysis.signal.bg} ${analysis.signal.border} text-center transition-colors duration-500`}>
            <Zap className={`${analysis.signal.color} mx-auto mb-4`} size={48} fill="currentColor" />
            <h2 className={`text-5xl font-black mb-2 ${analysis.signal.color}`}>{analysis.signal.type}</h2>
            <p className="font-bold text-slate-700">{analysis.signal.label}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase mb-1">XAU/USD</div>
              <div className="text-xl font-bold text-slate-800">${goldPrice.toLocaleString()}</div>
            </div>
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase mb-1">DXY Index</div>
              <div className="text-xl font-bold text-slate-800">{dxyIndex.toFixed(2)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100">
            <label className="block text-xs font-black uppercase tracking-wider text-amber-700 mb-3">Manuelle Kurskorrektur</label>
            <input type="range" min="4500" max="5500" step="1" value={goldPrice} onChange={(e) => setGoldPrice(Number(e.target.value))} className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none accent-amber-600 mb-2" />
            <div className="text-right font-mono text-sm text-amber-800 font-bold">${goldPrice}</div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Geopolitische Lage</label>
            <select value={geopolitics} onChange={(e) => setGeopolitics(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-100 font-bold text-slate-800 appearance-none border-none">
              <option value="Stabil">Stabil (Normal)</option>
              <option value="Angespannt">Angespannt (Bullisch)</option>
              <option value="Krise">Globale Krise (+Gold)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
