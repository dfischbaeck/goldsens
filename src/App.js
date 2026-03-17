import React, { useState, useEffect } from 'react';

export default function App() {
  const [gold, setGold] = useState(5012.15);
  const [dxy, setDxy] = useState(99.82);
  const [status, setStatus] = useState('SYNC');

  useEffect(() => {
    const ws = new WebSocket('wss://://stream.binance.com');
    ws.onopen = () => setStatus('LIVE');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.c) {
        setGold(parseFloat(data.c));
        setDxy(99.82 + (Math.random() - 0.5) * 0.05);
      }
    };
    return () => ws.close();
  }, []);

  const isBuy = dxy < 99.85;

  return (
    <div style={{ backgroundColor: '#0b0e11', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '14px', color: '#00FF00' }}>GOLDSENSE PRO ● {status}</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <div style={{ flex: 1, background: '#131722', padding: '15px', borderRadius: '10px', border: '1px solid #2a2e39' }}>
          <div style={{ fontSize: '10px', color: '#888' }}>GOLD (USD)</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00FF00' }}>${gold.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, background: '#131722', padding: '15px', borderRadius: '10px', border: '1px solid #2a2e39' }}>
          <div style={{ fontSize: '10px', color: '#888' }}>DXY INDEX</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{dxy.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '30px', borderRadius: '15px', border: '2px solid', borderColor: isBuy ? '#00FF00' : '#444', backgroundColor: isBuy ? 'rgba(0,255,0,0.1)' : 'transparent' }}>
        <div style={{ fontSize: '30px', fontWeight: 'bold', color: isBuy ? '#00FF00' : '#888' }}>
          {isBuy ? '▲ STRONG BUY' : '● NEUTRAL'}
        </div>
        <div style={{ fontSize: '10px', marginTop: '10px' }}>FAXT STRATEGY ACTIVE</div>
      </div>

      <div style={{ marginTop: '20px', height: '300px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #2a2e39' }}>
        <iframe src="https://s.tradingview.com" width="100%" height="100%" frameBorder="0"></iframe>
      </div>
    </div>
  );
}
