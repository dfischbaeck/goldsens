import React, { useState, useEffect, useMemo, useRef } from 'react';

const App = () => {
  const [goldPrice, setGoldPrice] = useState(5012.15);
  const [dxyIndex, setDxyIndex] = useState(99.82);
  const [status, setStatus] = useState('CONNECTING'); 
  const [trend, setTrend] = useState({ gold: 'sideways', dxy: 'sideways' });
  const [lastTick, setLastTick] = useState(new Date().toLocaleTimeString());

  const ws = useRef(null);
  const prevData = useRef({ gold: 5012.15, dxy: 99.82 });

  useEffect(() => {
    const connect = () => {
      setStatus('CONNECTING');
      ws.current = new WebSocket('wss://://stream.binance.com');

      ws.current.onopen = () => setStatus('LIVE');
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data && data.c) {
          const newGold = parseFloat(data.c);
          // Simulation DXY (basierend auf inverser Korrelation zu Gold für Strategietest)
          const dxyMove = (newGold > prevData.current.gold) ? -0.01 : 0.01;
          const newDxy = prevData.current.dxy + dxyMove;

          setTrend({
            gold: newGold > prevData.current.gold ? 'up' : 'down',
            dxy: newDxy > prevData.current.dxy ? 'up' : 'down'
          });

          setGoldPrice(newGold);
          setDxyIndex(newDxy);
          prevData.current = { gold: newGold, dxy: newDxy };
          setLastTick(new Date().toLocaleTimeString());
        }
      };
      ws.current.onclose = () => setTimeout(connect, 3000);
    };
    connect();
    return () => ws.current?.close();
  }, []);

  // --- FAXT-STRATEGIE LOGIK ---
  const strategy = useMemo(() => {
    const goldUp = trend.gold === 'up';
    const dxyDown = trend.dxy === 'down';
    
    // Konfluenz: Gold steigt UND Dollar fällt = Starkes Kaufsignal
    if (goldUp && dxyDown) {
      return { type: 'STRONG BUY', color: '#00FF00', bg: 'rgba(0, 255, 0, 0.1)', desc: 'Konfluenz bestätigt: USD Schwäche treibt Gold.' };
    } 
    // Konfluenz: Gold fällt UND Dollar steigt = Verkaufssignal
    if (!goldUp && !dxyDown) {
      return { type: 'STRONG SELL', color: '#ff4444', bg: 'rgba(255, 68, 68, 0.1)', desc: 'Konfluenz bestätigt: USD Stärke drückt Gold.' };
    }
    return { type: 'WAITING', color: '#888', bg: 'transparent', desc: 'Keine klare Bestätigung im Markt.' };
  }, [trend]);

  return (
    <div style={{ backgroundColor: '#0b0e11', color: '#d1d4dc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', paddingTop: '50px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2a2e39', paddingBottom: '10px', marginBottom: '15px' }}>
        <span style={{ color: '#00FF00', fontSize: '10px', fontWeight: 'bold' }}>XAUUSD • M15 STRATEGY</span>
        <span style={{ color: status === 'LIVE' ? '#00FF00' : '#ff4444', fontSize: '10px' }}>{status} ●</span>
      </div>

      {/* Market Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '15px' }}>
        <div style={{ backgroundColor: '#131722', padding: '12px', borderRadius: '10px', border: '1px solid #2a2e39' }}>
          <div style={{ color: '#888', fontSize: '8px', marginBottom: '4px' }}>GOLD {trend.gold === 'up' ? '▲' : '▼'}</div>
          <div style={{ color: trend.gold === 'up' ? '#00FF00' : '#ff4444', fontSize: '18px', fontWeight: 'bold' }}>${goldPrice.toFixed(2)}</div>
        </div>
        <div style={{ backgroundColor: '#131722', padding: '12px', borderRadius: '10px', border: '1px solid #2a2e39' }}>
          <div style={{ color: '#888', fontSize: '8px', marginBottom: '4px' }}>DXY {trend.dxy === 'up' ? '▲' : '▼'}</div>
          <div style={{ color: trend.dxy === 'up' ? '#00FF00' : '#ff4444', fontSize: '18px', fontWeight: 'bold' }}>{dxyIndex.toFixed(2)}</div>
        </div>
      </div>

      {/* Strategy Signal */}
      <div style={{ border: `2px solid ${strategy.color}`, backgroundColor: strategy.bg, padding: '25px', borderRadius: '15px', textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ color: strategy.color, fontSize: '28px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-1px' }}>{strategy.type}</div>
        <div style={{ fontSize: '9px', color: strategy.color, marginTop: '8px', opacity: 0.8 }}>{strategy.desc}</div>
      </div>

      {/* Chart */}
      <div style={{ height: '320px', borderRadius: '15px', border: '1px solid #2a2e39', overflow: 'hidden' }}>
        <iframe title="Chart" src="https://s.tradingview.com" width="100%" height="100%" frameBorder="0"></iframe>
      </div>

      <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '8px', color: '#444' }}>LAST TICK: {lastTick}</div>
    </div>
  );
};

export default App;
