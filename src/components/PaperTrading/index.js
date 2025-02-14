import React, { useState, useEffect } from 'react';

export const PaperTrading = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [buyForm, setBuyForm] = useState({ ticker: '', quantity: '', market: 'USD' });
  const [sellForm, setSellForm] = useState({ ticker: '', quantity: '' });
  const [message, setMessage] = useState('');
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [holdingsCount, setHoldingsCount] = useState(0); // Track total holdings

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('https://rapid-grossly-raven.ngrok-free.app/trade/portfolio');
      const data = await response.json();
      console.log("Portfolio API Response:", data); // Debugging

      if (data.portfolio) {
        setPortfolio(data.portfolio);
        setHoldingsCount(data.portfolio.length);
      } else {
        setPortfolio([]);
        setHoldingsCount(0);
        setMessage(data.message || "No holdings found");
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setMessage('Error fetching portfolio');
    }
};


  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://rapid-grossly-raven.ngrok-free.app/trade/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buyForm),
      });
      const data = await response.json();
      setMessage(data.message);
      fetchPortfolio();
      setBuyForm({ ticker: '', quantity: '', market: 'USD' });
    } catch (error) {
      setMessage('Error buying stock');
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://rapid-grossly-raven.ngrok-free.app/trade/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sellForm),
      });
      const data = await response.json();
      setMessage(data.message);
      fetchPortfolio();
      setSellForm({ ticker: '', quantity: '' });
    } catch (error) {
      setMessage('Error selling stock');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">📈 Paper Trading Platform</h2>

      {message && <p className="text-blue-600">{message}</p>}

      {/* Buy Form */}
      <form onSubmit={handleBuy} className="mt-4">
        <h3 className="text-xl font-semibold">Buy Stocks</h3>
        <input 
          type="text" 
          placeholder="Ticker" 
          value={buyForm.ticker} 
          onChange={(e) => setBuyForm({ ...buyForm, ticker: e.target.value.toUpperCase() })} 
          required 
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          value={buyForm.quantity} 
          onChange={(e) => setBuyForm({ ...buyForm, quantity: e.target.value })} 
          required 
        />
        <select value={buyForm.market} onChange={(e) => setBuyForm({ ...buyForm, market: e.target.value })}>
          <option value="USD">USD</option>
          <option value="INR">INR</option>
        </select>
        <button type="submit">Buy Stock</button>
      </form>

      {/* Sell Form */}
      <form onSubmit={handleSell} className="mt-4">
        <h3 className="text-xl font-semibold">Sell Stocks</h3>
        <input 
          type="text" 
          placeholder="Ticker" 
          value={sellForm.ticker} 
          onChange={(e) => setSellForm({ ...sellForm, ticker: e.target.value.toUpperCase() })} 
          required 
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          value={sellForm.quantity} 
          onChange={(e) => setSellForm({ ...sellForm, quantity: e.target.value })} 
          required 
        />
        <button type="submit">Sell Stock</button>
      </form>

      {/* View Portfolio Button */}
      <button 
        onClick={() => setShowPortfolio(!showPortfolio)} 
        className="mt-4 bg-blue-500 text-white px-4 py-2"
      >
        {showPortfolio ? 'Hide Portfolio' : 'View My Portfolio'}
      </button>

      {/* Portfolio */}
      {showPortfolio && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">📊 Portfolio</h3>
          
          {/* Show holdings count */}
          <p className="text-gray-700">Total Holdings: <strong>{holdingsCount}</strong></p>

          {portfolio.length > 0 ? (
            <table className="w-full border-collapse border border-gray-500 mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Ticker</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Purchase Price</th>
                  <th className="border p-2">Current Price</th>
                  <th className="border p-2">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                    {portfolio.length > 0 ? (
                    portfolio.map((holding, index) => (
                    <tr key={index} className="border">
                        <td className="border p-2">{holding.ticker}</td>
                        <td className="border p-2">{holding.quantity}</td>
                        <td className="border p-2">${holding.purchase_price?.toFixed(2) ?? "N/A"}</td>
                        <td className="border p-2">${holding.current_price?.toFixed(2) ?? "N/A"}</td>
                        <td className={`border p-2 ${holding.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(holding.profit_loss).toFixed(2) ?? "N/A"}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr><td colSpan="5" className="text-red-600 p-2">No holdings found</td></tr>
                )}
                </tbody>

            </table>
          ) : (
            <p className="text-red-600 mt-2">No holdings found</p>
          )}
        </div>
      )}
    </div>
  );
};
