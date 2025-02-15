import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./CSS/index.css";

export const TradingView = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [market, setMarket] = useState("INR");
  const [message, setMessage] = useState("");
  const [watchlist, setWatchlist] = useState([
    "NASDAQ:AAPL",
    "NASDAQ:GOOGL",
    "NASDAQ:MSFT",
    "NASDAQ:TSLA",
    "NYSE:BAC",
    "NYSE:JPM"
  ]);
  const [newWatchlistItem, setNewWatchlistItem] = useState("");
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);

  useEffect(() => {
    if (document.getElementById("tradingview-script")) return; // Prevent duplicate script injection
  
    const script = document.createElement("script");
    script.id = "tradingview-script";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    
    // Create widget options
    const widgetOptions = {
      width: "100%",
      height: 600,
      autosize: true,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "exchange",
      theme: "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: "tradingview-widget",
      studies: [
        "MASimple@tv-basicstudies",
        "RSI@tv-basicstudies",
        "Volume@tv-basicstudies"
      ],
      watchlist: [
        "NASDAQ:AAPL",
        "NASDAQ:GOOGL",
        "NASDAQ:MSFT",
        "NASDAQ:TSLA",
        "NYSE:BAC",
        "NYSE:JPM"
      ]
    };

    script.innerHTML = JSON.stringify(widgetOptions);
    document.getElementById("tradingview-widget").appendChild(script);

    // Add TradingView event listener
    window.addEventListener('DOMContentLoaded', () => {
      const interval = setInterval(() => {
        if (window.TradingView && document.querySelector('iframe')) {
          const iframe = document.querySelector('iframe');
          iframe.addEventListener('load', () => {
            window.addEventListener('message', (event) => {
              if (event.data && typeof event.data === 'string') {
                try {
                  const data = JSON.parse(event.data);
                  if (data.name === 'symbolChange') {
                    const symbol = data.data[0].split(':')[1]; // Extract ticker from "NASDAQ:AAPL" format
                    setTicker(symbol);
                    
                    // Determine market based on exchange
                    const exchange = data.data[0].split(':')[0];
                    if (exchange === 'NSE' || exchange === 'BSE') {
                      setMarket('INR');
                    } else {
                      setMarket('USD');
                    }
                  }
                } catch (e) {
                  // Ignore parsing errors for non-relevant messages
                }
              }
            });
          });
          clearInterval(interval);
        }
      }, 500);
    });

    return () => {
      // Cleanup event listeners if needed
      window.removeEventListener('message', () => {});
    };
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

  // Function to add stock to watchlist
  const addToWatchlist = useCallback(() => {
    if (!newWatchlistItem) return;
    
    // Format the input to match TradingView format
    let formattedItem = newWatchlistItem.toUpperCase();
    if (!formattedItem.includes(':')) {
      formattedItem = `NASDAQ:${formattedItem}`; // Default to NASDAQ if no exchange specified
    }
    
    if (!watchlist.includes(formattedItem)) {
      const newWatchlist = [...watchlist, formattedItem];
      setWatchlist(newWatchlist);
      // Reinitialize TradingView widget with new watchlist
      reinitializeTradingViewWidget(newWatchlist);
    }
    setNewWatchlistItem("");
  }, [newWatchlistItem, watchlist]);

  // Function to remove stock from watchlist
  const removeFromWatchlist = useCallback((itemToRemove) => {
    const newWatchlist = watchlist.filter(item => item !== itemToRemove);
    setWatchlist(newWatchlist);
    // Reinitialize TradingView widget with new watchlist
    reinitializeTradingViewWidget(newWatchlist);
  }, [watchlist]);

  // Function to reinitialize the TradingView widget
  const reinitializeTradingViewWidget = useCallback((newWatchlist) => {
    // Remove existing widget
    const container = document.getElementById("tradingview-widget");
    container.innerHTML = "";

    // Create new widget with updated watchlist
    const script = document.createElement("script");
    script.id = "tradingview-script";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    const widgetOptions = {
      width: "100%",
      height: 600,
      autosize: true,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "exchange",
      theme: "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: "tradingview-widget",
      studies: [
        "MASimple@tv-basicstudies",
        "RSI@tv-basicstudies",
        "Volume@tv-basicstudies"
      ],
      watchlist: newWatchlist
    };

    script.innerHTML = JSON.stringify(widgetOptions);
    container.appendChild(script);
  }, []);

  return (
    <div className="trading-container">
      <h1>Welcome to the Paper Trading Platform</h1>

      {/* Watchlist Management Button */}
      <div className="watchlist-management">
        <button 
          className="manage-watchlist-button"
          onClick={() => setShowWatchlistModal(true)}
        >
          📋 Manage Watchlist
        </button>
      </div>

      {/* Watchlist Modal */}
      {showWatchlistModal && (
        <div className="modal-overlay">
          <div className="watchlist-modal">
            <h3>Manage Watchlist</h3>
            
            <div className="add-watchlist-item">
              <input
                type="text"
                value={newWatchlistItem}
                onChange={(e) => setNewWatchlistItem(e.target.value)}
                placeholder="Enter stock symbol (e.g., NASDAQ:AAPL)"
              />
              <button onClick={addToWatchlist}>Add</button>
            </div>

            <ul className="watchlist-items">
              {watchlist.map((item, index) => (
                <li key={index}>
                  {item}
                  <button 
                    onClick={() => removeFromWatchlist(item)}
                    className="remove-button"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>

            <button 
              className="close-modal-button"
              onClick={() => setShowWatchlistModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* TradingView Widget */}
      <div id="tradingview-widget"></div>

      {/* Portfolio Section */}
      <div className="portfolio-section">
        <h2>Your Portfolio</h2>
        <button className="refresh-button" onClick={fetchPortfolio}>
          🔄 Refresh Portfolio
        </button>

        {portfolio.length > 0 ? (
          <ul className="portfolio-list">
            {portfolio.map((stock, index) => (
              <li key={index} className="stock-item">
                <div className="stock-header">
                  <strong>{stock.ticker}</strong> ({stock.market})
                </div>
                <div className="stock-details">
                  <div className="stock-detail-item">📈 Total Shares: {stock.total_quantity}</div>
                  <div className="stock-detail-item">💰 Average Cost: ₹{stock.average_cost?.toFixed(2)}</div>
                  <div className="stock-detail-item">🏷️ Current Price: ₹{stock.current_price?.toFixed(2)}</div>
                  <div className="stock-detail-item">📊 Total Cost: ₹{stock.total_cost?.toFixed(2)}</div>
                  <div className="stock-detail-item">💼 Market Value: ₹{stock.total_market_value?.toFixed(2)}</div>
                  <div className="stock-detail-item">💹 Unrealized P&L: ₹{stock.unrealized_pl?.toFixed(2)}</div>
                </div>
                <div>
                  <h4>️ Lots Purchased:</h4>
                  <ul className="lots-list">
                    {stock.lots.map((lot) => (
                      <li key={lot.lot_id} className="lot-item">
                        📅 {new Date(lot.purchase_date).toLocaleString()} - {lot.quantity} shares @ ₹{lot.purchase_price?.toFixed(2)}
                        (Cost: ₹{lot.cost_basis?.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No stocks owned yet.</p>
        )}
      </div>

      {/* Buy & Sell Stock Section */}
      <div className="trading-form">
        <h2>Trade Stocks</h2>
        <div className="form-group">
          <label>Ticker:</label>
          <input
            type="text"
            placeholder="Enter ticker (e.g., AAPL)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
          />
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Market:</label>
          <select value={market} onChange={(e) => setMarket(e.target.value)}>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="trading-buttons">
          <button className="buy-button" onClick={buyStock}>🟢 Buy</button>
          <button className="sell-button" onClick={sellStock}>🔴 Sell</button>
        </div>

        {/* Status Message */}
        {message && <div className="status-message">{message}</div>}
      </div>
    </div>
  );
};
