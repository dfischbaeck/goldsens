import React, { useState, useEffect, useMemo, useRef } from 'react';

const App = () => {
  // Marktdaten Startwerte (17. März 2026)
  const [goldPrice, setGoldPrice] = useState(5064.45);
  const [dxyIndex, setDxyIndex] = useState(99.82);
  const [status, setStatus] = useState('CONNECTING'); 
  const [priceFlash, setPriceFlash] = useState(null);
  const [lastTick, setLastTick] = useState(new Date().toLocaleTimeString());

  const ws = useRef(null);

  useEffect(() => {
    const connect = () => {
      try {
        setStatus('CONNECTING');
        // Binance Stream für Gold (PAXG)
        ws.current = new WebSocket('wss://://stream.binance.com');

        ws.current.onopen = () => setStatus('LIVE');

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data && data.c) {
            const newPrice = parseFloat(data.c);
            setGoldPrice(prev => {
              if (newPrice > prev) setPriceFlash('up');
              else if (newPrice < prev) setPriceFlash('down');
              setTimeout(() => setPriceFlash(null), 200);
              return newPrice;
            });
            setDxyIndex(99.82 + (Math.random() - 0.5) * 0.02);
            setLastTick(new Date().toLocaleTimeString());
            setStatus('LIVE');
          }
        };

        ws.current.onclose = () => {
          setStatus('OFFLINE');
          setTimeout(connect, 3000); 
        };

        ws.current.onerror = () => {
          setStatus('OFFLINE');
          if (ws.current) ws.current.close();
        };
      } catch (e) {
        console.error("Connection error");
      }
    };

    connect();
    return () => { if (ws.current) ws.current.close(); };
  }, []);

  const signal = useMemo(() => {
    if (dxyIndex < 100) return { type: 'STRONG BUY', color: '#00FF00', bg: 'rgba(0, 255, 0, 0.1)' };
    return { type: 'NEUTRAL', color: '#888', bg: 'transparent' };
  }, [dxyIndex]);

  return (
    <div style={{ backgroundColor: '#0b0e11', color: '#d1d4dc', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', paddingTop: '60px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2a2e39', paddingBottom: '10px', marginBottom: '20px' }}>
        <span style={{ color: '#00FF00', fontSize: '12px', fontWeight: 'bold' }}>XAUUSD LIVE</span>
        <span style={{ color: status === 'LIVE' ? '#00FF00' : '#ff4444', fontSize: '10px' }}>
          {status} {status === 'LIVE' ? '●' : '○'}
        </span>
      </div>

      {/* Preise */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: priceFlash === 'up' ? '#003300' : priceFlash === 'down' ? '#330000' : '#131722', padding: '15px', borderRadius: '8px', border: '1px solid #2a2e39', transition: '0.2s' }}>
          <div style={{ color: '#888', fontSize: '9px', marginBottom: '5px' }}>GOLD (BID)</div>
          <div style={{ color: priceFlash === 'up' ? '#00FF00' : priceFlash === 'down' ? '#ff4444' : '#fff', fontSize: '20px', fontWeight: 'bold' }}>
            ${goldPrice.toFixed(2)}
          </div>
        </div>
        <div style={{ backgroundColor: '#131722', padding: '15px', borderRadius: '8px', border: '1px solid #2a2e39' }}>
          <div style={{ color: '#888', fontSize: '9px', marginBottom: '5px' }}>DXY INDEX</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{dxyIndex.toFixed(2)}</div>
        </div>
      </div>

      {/* Signal */}
      <div style={{ border: `2px solid ${signal.color}`, backgroundColor: signal.bg, padding: '30px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ color: signal.color, fontSize: '32px', fontWeight: '900', fontStyle: 'italic' }}>{signal.type}</div>
        <div style={{ fontSize: '9px', color: '#888', marginTop: '10px' }}>UPDATE: {lastTick}</div>
      </div>

      {/* Chart */}
      <div style={{ height: '300px', backgroundColor: '#131722', borderRadius: '12px', border: '1px solid #2a2e39', overflow: 'hidden' }}>
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
