import React, { useState, useMemo } from 'react';
import { TrendingUp, Globe, Settings, Activity, Zap, DollarSign } from 'lucide-react';

const App = () => {
  const [goldPrice, setGoldPrice] = useState(2154.45);
  const [dxyIndex, setDxyIndex] = useState(103.50);
  const [us10y, setUs10y] = useState(4.25);
  const [geopolitics, setGeopolitics] = useState('Stabil'); 
  const [activeTab, setActiveTab] = useState('signals');

  const analysis = useMemo(() => {
    const rsi = 30 + (Math.sin(goldPrice / 10) * 20 + 25); 
    const isTechnicalBuy = rsi < 35;
    const isTechnicalSell = rsi > 65;
    const dxyWeakening = dxyIndex < 103.8;
    const yieldsFalling = us10y < 4.28;
    const geopoliticalRisk = geopolitics === 'Krise' || geopolitics === 'Angespannt';

    let score = 0;
    if (isTechnicalBuy) score += 2;
    if (dxyWeakening) score += 1.5;
    if (yieldsFalling) score += 1;
    if (geopoliticalRisk) score += 2.5;
    if (isTechnicalSell) score -= 2;
    if (dxyIndex > 104.2) score -= 1.5;
    if (us10y > 4.35) score -= 1;

    let signal = { type: 'NEUTRAL', label: 'Warten', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', description: 'Markt wartet auf Impulse.' };
    if (score >= 4) signal = { type: 'STRONG BUY', label: 'Kaufen', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', description: 'Perfektes Setup: Technik & Makro sind bullisch.' };
    else if (score >= 1.5) signal = { type: 'BUY', label: 'Einstieg suchen', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', description: 'Leichter Aufwärtstrend erkennbar.' };
    else if (score <= -2) signal = { type: 'SELL', label: 'Verkaufen', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', description: 'Überhitzt. Dollar-Stärke drückt Gold.' };

    return { score, signal, rsi };
  }, [goldPrice, dxyIndex, us10y, geopolitics]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen font-sans safe-top">
      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-2 rounded-xl text-white shadow-lg shadow-amber-200"><DollarSign size={20}/></div>
          <h1 className="text-xl font-bold tracking-tight">GoldSense</h1>
        </div>
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
          <button onClick={() => setActiveTab('signals')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'signals' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>SIGNALE</button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>MARKT</button>
        </div>
      </div>

      {activeTab === 'signals' ? (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className={`p-6 rounded-[2rem] border-2 ${analysis.signal.bg} ${analysis.signal.border} shadow-sm`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${analysis.signal.color}`}>Live Analyse</span>
              <Zap className={analysis.signal.color} size={24} fill="currentColor" />
            </div>
            <h2 className={`text-5xl font-black mb-2 ${analysis.signal.color}`}>{analysis.signal.type}</h2>
            <p className="font-bold text-slate-800 text-lg">{analysis.signal.label}</p>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{analysis.signal.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">RSI Index</div>
              <div className="text-2xl font-bold text-slate-800">{analysis.rsi.toFixed(1)}</div>
            </div>
            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">Confidence</div>
              <div className="text-2xl font-bold text-slate-800">{((Math.abs(analysis.score) / 7) * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-2 animate-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between font-bold text-sm"><span>Gold Preis ($)</span><span className="text-amber-600">{goldPrice}</span></div>
              <input type="range" min="1900" max="2600" value={goldPrice} onChange={(e) => setGoldPrice(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-amber-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between font-bold text-sm"><span>US Dollar (DXY)</span><span className="text-blue-600">{dxyIndex}</span></div>
              <input type="range" min="100" max="110" step="0.1" value={dxyIndex} onChange={(e) => setDxyIndex(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-blue-600" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-bold">Geopolitik</label>
              <select value={geopolitics} onChange={(e) => setGeopolitics(e.target.value)} className="w-full p-4 rounded-2xl border-none bg-slate-100 font-medium">
                <option value="Stabil">Stabil (Normal)</option>
                <option value="Angespannt">Angespannt (Bullisch)</option>
                <option value="Krise">Krise (Extrem)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
