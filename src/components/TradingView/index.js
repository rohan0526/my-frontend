import React, { useEffect, useState } from "react";
import axios from "axios";

export const TradingView = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [market, setMarket] = useState("INR");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (document.getElementById("tradingview-script")) return; // Prevent duplicate script injection
  
    const script = document.createElement("script");
    script.id = "tradingview-script";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "light",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "100%",
      height: "600",
      tabs: [
        {
          title: "Indices",
          symbols: [
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
            { s: "FOREXCOM:DJI", d: "Dow 30" },
          ],
        },
        {
          title: "Stocks",
          symbols: [
            { s: "NASDAQ:AAPL", d: "Apple" },
            { s: "NASDAQ:TSLA", d: "Tesla" },
            { s: "NASDAQ:GOOGL", d: "Google" },
          ],
        },
      ],
    });
  
    document.getElementById("tradingview-widget").appendChild(script);
  }, []);
  
  // Fetch Portfolio
  const fetchPortfolio = () => {
    console.log("Fetching portfolio...");
    axios
      .get("https://rapid-grossly-raven.ngrok-free.app/trade/portfolio", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("Portfolio response:", res.data);

        if (!res.data || !res.data.portfolio) {
          console.warn("Empty or invalid portfolio response");
          return;
        }

        // Convert object to array
        const portfolioArray = Object.entries(res.data.portfolio).map(([ticker, stock]) => ({
          ticker,
          ...stock,
        }));

        console.log("Formatted Portfolio Array:", portfolioArray);
        setPortfolio(portfolioArray);
      })
      .catch((err) => {
        console.error("Error fetching portfolio:", err);
        if (err.response) console.error("Response data:", err.response.data);
      });
  };

  // Buy Stock
  const buyStock = () => {
    console.log("Buying stock:", { ticker, quantity, market });
    axios
      .post(
        "https://rapid-grossly-raven.ngrok-free.app/trade/buy",
        { ticker, quantity, market },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("Buy response:", res.data);
        setMessage(res.data.message);
        fetchPortfolio(); // Refresh portfolio
      })
      .catch((err) => {
        console.error("Error buying stock:", err);
        setMessage(err.response?.data?.error || "Purchase failed");
      });
  };

  // Sell Stock
  const sellStock = () => {
    console.log("Selling stock:", { ticker, quantity });
    axios
      .post(
        "https://rapid-grossly-raven.ngrok-free.app/trade/sell",
        { ticker, quantity },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("Sell response:", res.data);
        setMessage(res.data.message);
        fetchPortfolio(); // Refresh portfolio
      })
      .catch((err) => {
        console.error("Error selling stock:", err);
        setMessage(err.response?.data?.error || "Sale failed");
      });
  };

  return (
    <div>
      <h1>Welcome to the Paper Trading Platform</h1>

      {/* TradingView Widget */}
      <div id="tradingview-widget"></div>

      {/* Portfolio Section */}
      <h2>Your Portfolio</h2>
      <button onClick={fetchPortfolio}>🔄 Refresh Portfolio</button>

      {portfolio.length > 0 ? (
        <ul>
          {portfolio.map((stock, index) => (
            <li key={index}>
              <strong>{stock.ticker}</strong> ({stock.market})
              <ul>
                <li>📈 Total Shares: {stock.total_quantity}</li>
                <li>💰 Average Cost: ₹{stock.average_cost?.toFixed(2)}</li>
                <li>🏷️ Current Price: ₹{stock.current_price?.toFixed(2)}</li>
                <li>📊 Total Cost: ₹{stock.total_cost?.toFixed(2)}</li>
                <li>💼 Market Value: ₹{stock.total_market_value?.toFixed(2)}</li>
                <li>💹 Unrealized P&L: ₹{stock.unrealized_pl?.toFixed(2)}</li>
                <li>🛍️ Lots Purchased:</li>
                <ul>
                  {stock.lots.map((lot) => (
                    <li key={lot.lot_id}>
                      📅 {new Date(lot.purchase_date).toLocaleString()} - {lot.quantity} shares @ ₹{lot.purchase_price?.toFixed(2)}  
                      (Cost: ₹{lot.cost_basis?.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No stocks owned yet.</p>
      )}

      {/* Buy & Sell Stock Section */}
      <h2>Trade Stocks</h2>
      <div>
        <label>Ticker:</label>
        <input
          type="text"
          placeholder="Enter ticker (e.g., AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
      </div>

      <div>
        <label>Quantity:</label>
        <input
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Market:</label>
        <select value={market} onChange={(e) => setMarket(e.target.value)}>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <button onClick={buyStock}>🟢 Buy</button>
      <button onClick={sellStock}>🔴 Sell</button>

      {/* Status Message */}
      {message && <p>{message}</p>}
    </div>
  );
};
