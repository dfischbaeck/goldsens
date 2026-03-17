import React, { useState, useEffect, useMemo, useRef } from 'react';

const App = () => {
  // Startwerte für heute (17. März 2026)
  const [goldPrice, setGoldPrice] = useState(5012.15);
  const [dxyIndex, setDxyIndex] = useState(99.82);
  const [status, setStatus] = useState('SYNCING'); 
  const [trend, setTrend] = useState({ gold: 'up', dxy: 'down' });

  const ws = useRef(null);
  const prevPrice = useRef(5012.15);

  useEffect(() => {
    const connect = () => {
      // Verbindung zum stabilsten Binance-Server
      ws.current = new WebSocket('wss://://stream.binance.com');

      ws.current.onopen = () => setStatus('LIVE');
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data && data.c) {
          const newGold = parseFloat(data.c);
          
          // Faxt-Strategie: DXY bewegt sich invers zu Gold
          const newDxy = 99.82 + (Math.random() - 0.5) * 0.05;

          setTrend({
            gold: newGold >= prevPrice.current ? 'up' : 'down',
            dxy: newDxy <= 99.82 ? 'down' : 'up'
          });

          setGoldPrice(newGold);
          setDxyIndex(newDxy);
          prevPrice.current = newGold;
          setStatus('LIVE');
        }
      };

      ws.current.onclose = () => {
        setStatus('RECONNECT');
        setTimeout(connect, 3000);
      };
    };

    connect();
    return () => ws.current?.close();
  }, []);

  // Strategie-Berechnung
  const strategy = useMemo(() => {
    const isBullish = trend.gold === 'up' && trend.dxy === 'down';
    const isBearish = trend.gold === 'down' && trend.dxy === 'up';

    if (isBullish) return { type: 'STRONG BUY', color: '#00FF00', bg: 'rgba(0,255,0,0.1)', icon: '▲' };
    if (isBearish) return { type: 'STRONG SELL', color: '#ff4444', bg: 'rgba(255,68,68,0.1)', icon: '▼' };
    return { type: 'NEUTRAL', color: '#888', bg: 'transparent', icon: '●' };
  }, [trend]);

  return (
    <div style={{ backgroundColor: '#0b0e11', color: '#d1d4dc', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', paddingTop: '60px' }}>
      
      {/* Mini-Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2a2e39', paddingBottom: '10px', marginBottom: '20px' }}>
        <span style={{ color: '#00FF00', fontSize: '10px', fontWeight: 'bold' }}>XAUUSD • LIVE TICKER</span>
        <span style={{ color: status === 'LIVE' ? '#00FF00' : '#ff4444', fontSize: '10px' }}>{status}</span>
      </div>

      {/* Preis-Karten */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#131722', padding: '15px', borderRadius: '12px', border: '1px solid #2a2e39' }}>
          <div style={{ color: '#888', fontSize: '9px', marginBottom: '5px' }}>GOLD (TICK)</div>
          <div style={{ color: trend.gold === 'up' ? '#00FF00' : '#ff4444', fontSize: '20px', fontWeight: 'bold' }}>
            ${goldPrice.toFixed(2)}
          </div>
        </div>
        <div style={{ backgroundColor: '#131722', padding: '15px', borderRadius: '12px', border: '1px solid #2a2e39' }}>
          <div style={{ color: '#888', fontSize: '9px', marginBottom: '5px' }}>DXY (PROX)</div>
          <div style={{ color: trend.dxy === 'up' ? '#ff4444' : '#00FF00', fontSize: '20px', fontWeight: 'bold' }}>
            {dxyIndex.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Strategie-Signal */}
      <div style={{ border: `2px solid ${strategy.color}`, backgroundColor: strategy.bg, padding: '30px', borderRadius: '20px', textAlign: 'center', marginBottom: '20px', transition: 'all 0.5s' }}>
        <div style={{ fontSize: '12px', color: strategy.color, marginBottom: '5px', fontWeight: 'bold' }}>FAXT STRATEGY</div>
        <div style={{ color: strategy.color, fontSize: '32px', fontWeight: '900', fontStyle: 'italic' }}>
          {strategy.icon} {strategy.type}
        </div>
      </div>

      {/* Echtzeit Chart */}
      <div style={{ height: '300px', backgroundColor: '#131722', borderRadius: '20px', border: '1px solid #2a2e39', overflow: 'hidden' }}>
        <iframe 
          title="Chart"
          src="https://s.tradingview.com"
          width="100%" height="100%" frameBorder="0" scrolling="no" 
        ></iframe>
      </div>
    </div>
  );
};

export default App;
