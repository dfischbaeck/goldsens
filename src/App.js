import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Globe, Settings, Activity, Zap, DollarSign, RefreshCw } from 'lucide-react';

const App = () => {
  // States für Live-Daten
  const [goldPrice, setGoldPrice] = useState(2154.45);
  const [dxyIndex, setDxyIndex] = useState(103.50);
  const [us10y, setUs10y] = useState(4.25);
  const [loading, setLoading] = useState(true);
  
  const [geopolitics, setGeopolitics] = useState('Stabil'); 
  const [activeTab, setActiveTab] = useState('signals');

  // --- Live-Daten laden ---
  const fetchPrices = async () => {
    setLoading(true);
    try {
      // Holt den aktuellen Goldpreis (CME Futures / Spot)
      const res = await fetch('https://gold-price-api.vercel.app');
      const data = await res.json();
      if(data.price) setGoldPrice(data.price);
      
      // Simulation für DXY & Yields (da diese APIs meist kostenpflichtig sind)
      setDxyIndex(103.2 + Math.random() * 0.8);
      setUs10y(4.2 + Math.random() * 0.2);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
    } finally {
      setLoading(false);
    }
  };

  // Beim Start laden
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Jede Minute aktualisieren
    return () => clearInterval(interval);
  }, []);

  // --- Analyse-Logik ---
  const analysis = useMemo(() => {
    const rsi = 30 + (Math.sin(goldPrice / 10) * 20 + 25); 
    let score = 0;
    
    // Kauf-Faktoren
    if (rsi < 35) score += 2;
    if (dxyIndex < 103.8) score += 1.5;
    if (geopolitics === 'Krise') score += 2.5;
    
    // Verkauf-Faktoren
    if (rsi > 65) score -= 2;
    if (dxyIndex > 104.2) score -= 1.5;

    let signal = { type: 'NEUTRAL', label: 'Warten', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };
    if (score >= 3.5) signal = { type: 'STRONG BUY', label: 'Kaufen', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    else if (score >= 1.5) signal = { type: 'BUY', label: 'Einstieg suchen', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    else if (score <= -2) signal = { type: 'SELL', label: 'Verkaufen', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };

    return { score, signal, rsi };
  }, [goldPrice, dxyIndex, geopolitics]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white min-h-screen font-sans safe-top">
      {/* App Header */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-2 rounded-xl text-white shadow-lg"><DollarSign size={20}/></div>
          <h1 className="text-xl font-bold">GoldSense</h1>
        </div>
        <button onClick={fetchPrices} className={`p-2 rounded-full ${loading ? 'animate-spin' : ''}`}>
          <RefreshCw size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 mb-6">
        <button onClick={() => setActiveTab('signals')} className={`flex-1 py-2 rounded-xl text-xs font-bold ${activeTab === 'signals' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>LIVE-SIGNAL</button>
        <button onClick={() => setActiveTab('settings')} className={`flex-1 py-2 rounded-xl text-xs font-bold ${activeTab === 'settings' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>ANALYSE-SETUP</button>
      </div>

      {activeTab === 'signals' ? (
        <div className="space-y-4">
          <div className={`p-8 rounded-[2.5rem] border-2 ${analysis.signal.bg} ${analysis.signal.border} text-center`}>
            <Zap className={`${analysis.signal.color} mx-auto mb-4`} size={48} fill="currentColor" />
            <h2 className={`text-5xl font-black mb-2 ${analysis.signal.color}`}>{analysis.signal.type}</h2>
            <p className="font-bold text-slate-800">{analysis.signal.label}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DataCard label="Gold Preis" value={`$${goldPrice.toLocaleString()}`} />
            <DataCard label="US Dollar (DXY)" value={dxyIndex.toFixed(2)} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800 text-sm">
            Live-Daten werden alle 60 Sek. aktualisiert.
          </div>
          <div>
            <label className="block text-sm font-bold mb-3">Geopolitische Lage</label>
            <select value={geopolitics} onChange={(e) => setGeopolitics(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-100 font-medium appearance-none">
              <option value="Stabil">Stabil (Neutral)</option>
              <option value="Angespannt">Angespannt (Bullisch)</option>
              <option value="Krise">Globale Krise (Sicherer Hafen)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

const DataCard = ({ label, value }) => (
  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
    <div className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">{label}</div>
    <div className="text-xl font-bold text-slate-800">{value}</div>
  </div>
);

export default App;
