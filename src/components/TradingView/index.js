import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./CSS/index.css";

export const TradingView = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [market, setMarket] = useState("USD");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
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
  const [activeChartTab, setActiveChartTab] = useState("Monthly");
  const [stockCards, setStockCards] = useState([
    { 
      symbol: "AAPL", 
      name: "Apple, Inc", 
      price: "$1,232.00", 
      change: "+11.01%", 
      isUp: true, 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.8943 17.3641C18.4758 18.2963 18.0125 19.185 17.0934 20.0738C16.4515 20.6746 15.6726 21.2755 14.5593 21.2845C13.5248 21.2935 13.1953 20.717 11.9746 20.717C10.7539 20.717 10.3875 21.2845 9.40386 21.2935C8.2996 21.3025 7.4488 20.6478 6.7979 20.0381C5.01721 18.1902 3.6354 14.7333 5.46695 12.3924C6.37509 11.2369 7.75776 10.5367 9.22844 10.5277C10.3057 10.5188 11.3043 11.1464 11.9746 11.1464C12.6448 11.1464 13.8476 10.3749 15.1396 10.5188C15.7725 10.5456 17.562 10.7524 18.7106 12.3745C18.6119 12.4372 16.2033 13.8391 16.2213 16.2994C16.2303 16.7737 16.3109 17.0698 16.3829 17.239C16.2754 17.2746 15.6456 17.5618 14.9933 18.2351C14.4223 18.8092 13.9499 19.5898 13.7798 20.717C13.6456 21.6058 13.8476 22.5392 14.0135 23C14.1435 23.0001 14.3456 23.0001 14.5593 21.2845" fill="#0A0A30"/>
              <path d="M12 11.1464V3.0012" stroke="#0A0A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.23022 5.1955H14.7692" stroke="#0A0A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
    },
    { 
      symbol: "PYPL", 
      name: "Paypal, Inc", 
      price: "$965.00", 
      change: "-9.05%", 
      isUp: false, 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.6 7.2H5.4C4.08 7.2 3 8.28 3 9.6V16.8C3 18.12 4.08 19.2 5.4 19.2H18.6C19.92 19.2 21 18.12 21 16.8V9.6C21 8.28 19.92 7.2 18.6 7.2Z" stroke="#0A0A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12H21" stroke="#0A0A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
    },
    { 
      symbol: "TSLA", 
      name: "Tesla, Inc", 
      price: "$1,232.00", 
      change: "+11.01%", 
      isUp: true, 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.8 5.2002H6.2C4.94 5.2002 3.9 6.24019 3.9 7.50019V14.7002C3.9 15.9602 4.94 17.0002 6.2 17.0002H17.8C19.06 17.0002 20.1 15.9602 20.1 14.7002V7.50019C20.1 6.24019 19.06 5.2002 17.8 5.2002Z" stroke="#0A0A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 20.1001H15.5" stroke="#0A0A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17V20.1" stroke="#0A0A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
    },
    { 
      symbol: "AMZN", 
      name: "Amazone.com, Inc", 
      price: "$2,567.99", 
      change: "+11.01%", 
      isUp: true, 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.69995 20.1001L7.89995 17.0001H5.99995V20.1001H4.79995V13.9001H8.09995C8.62995 13.9001 9.09995 14.0901 9.44995 14.4401C9.79995 14.7901 9.99995 15.2401 9.99995 15.7701C9.99995 16.1801 9.88995 16.5401 9.67995 16.8401C9.46995 17.1401 9.19995 17.3601 8.84995 17.4801L10.8 20.1001H9.69995ZM5.99995 15.0001V16.0001H8.09995C8.29995 16.0001 8.46995 15.9301 8.59995 15.8001C8.72995 15.6701 8.79995 15.5001 8.79995 15.3001C8.79995 15.1001 8.72995 14.9301 8.59995 14.8001C8.46995 14.6701 8.29995 14.6001 8.09995 14.6001H5.99995V15.0001Z" fill="#0A0A30"/>
              <path d="M14.3 20.1001C13.7 20.1001 13.16 19.9801 12.7 19.7501C12.24 19.5201 11.88 19.1901 11.64 18.7701C11.4 18.3601 11.27 17.8801 11.27 17.3501C11.27 16.8201 11.4 16.3501 11.65 15.9301C11.9 15.5101 12.25 15.1801 12.71 14.9501C13.17 14.7201 13.7 14.6001 14.32 14.6001C14.94 14.6001 15.47 14.7201 15.93 14.9501C16.39 15.1801 16.74 15.5001 16.99 15.9301C17.24 16.3501 17.37 16.8201 17.37 17.3501C17.37 17.8801 17.24 18.3601 17 18.7701C16.75 19.1901 16.39 19.5201 15.94 19.7501C15.47 19.9801 14.92 20.1001 14.3 20.1001ZM14.3 18.9001C14.76 18.9001 15.14 18.7501 15.44 18.4401C15.74 18.1301 15.89 17.7801 15.89 17.3301C15.89 16.8801 15.74 16.5301 15.44 16.2201C15.14 15.9101 14.76 15.7601 14.3 15.7601C13.84 15.7601 13.46 15.9101 13.16 16.2201C12.86 16.5301 12.71 16.8801 12.71 17.3301C12.71 17.7801 12.86 18.1301 13.16 18.4401C13.46 18.7501 13.84 18.9001 14.3 18.9001Z" fill="#0A0A30"/>
              <path d="M19.5 20.1001H18.2V14.6001H19.5V20.1001Z" fill="#0A0A30"/>
              <path d="M21.8999 8.4L19.6999 7.12L17.8999 4.57H15.8999L14.8999 3H9.19995L8.19995 4.57H6.19995L4.39995 7.12L2.19995 8.4L1.19995 10.83V19.26H2.19995V10.83H3.19995L4.89995 7.69H19.1999L20.8999 10.83H21.8999V19.26H22.8999V10.83L21.8999 8.4Z" stroke="#0A0A30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
    }
  ]);

  // Get token and userId from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.user_id) {
          setUserId(userData.user_id);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (document.getElementById("tradingview-script")) return; // Prevent duplicate script injection
  
    const script = document.createElement("script");
    script.id = "tradingview-script";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    
    // Create widget options with adjusted height
    const widgetOptions = {
      width: "100%",
      height: "100%",
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
  
  // Call fetchPortfolio when token and userId are available
  useEffect(() => {
    if (token && userId) {
      fetchPortfolio();
    }
  }, [token, userId]);

  // Fetch Portfolio
  const fetchPortfolio = () => {
    console.log("Fetching portfolio...");
    axios
      .get("https://rapid-grossly-raven.ngrok-free.app/trade/portfolio", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        params: {
          user_id: userId
        }
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
        { ticker, quantity, market, user_id: userId },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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
        { ticker, quantity, user_id: userId },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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
      height: 800,
      autosize: false,
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
      <h1>Paper Trading Platform</h1>
      
      {/* No stock cards section here */}
      
      <div className="trading-layout">
        <div className="trading-layout-left">
          <div className="chart-section">
            <div className="chart-header">
              <h2>Market Chart</h2>
              <div className="chart-tabs">
                <button 
                  className={`chart-tab ${activeChartTab === "Daily" ? "active" : ""}`}
                  onClick={() => setActiveChartTab("Daily")}
                >
                  Daily
                </button>
                <button 
                  className={`chart-tab ${activeChartTab === "Weekly" ? "active" : ""}`}
                  onClick={() => setActiveChartTab("Weekly")}
                >
                  Weekly
                </button>
                <button 
                  className={`chart-tab ${activeChartTab === "Monthly" ? "active" : ""}`}
                  onClick={() => setActiveChartTab("Monthly")}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div id="tradingview-widget"></div>
          </div>
        </div>
        
        <div className="trading-layout-right">
          {/* Trading Form */}
          <div className="trading-form">
            <h2>Trade Stocks</h2>
            
            <div className="form-group">
              <label htmlFor="ticker">Ticker:</label>
              <input
                type="text"
                id="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Enter ticker (e.g., AAPL)"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="market">Market:</label>
              <select 
                id="market"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>
            </div>
            
            <div className="trading-buttons">
              <button className="buy-button" onClick={buyStock}>
                Buy
              </button>
              <button className="sell-button" onClick={sellStock}>
                Sell
              </button>
            </div>

            {/* Status Message */}
            {message && <div className="status-message">{message}</div>}
          </div>
          
          {/* Portfolio Section */}
          <div className="portfolio-section">
            <div className="section-header">
              <h2>Your Portfolio</h2>
              <button className="refresh-button" onClick={fetchPortfolio}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                Refresh Portfolio
              </button>
            </div>

            {portfolio.length > 0 ? (
              <ul className="portfolio-list">
                {portfolio.map((stock, index) => (
                  <li key={index} className="stock-item">
                    <div className="stock-header">
                      <strong>{stock.ticker}</strong> ({stock.market})
                    </div>
                    <div className="stock-details">
                      <div className="stock-detail-item">
                        <strong>Total Shares</strong>
                        <div className="stock-detail-value">{stock.total_quantity}</div>
                      </div>
                      <div className="stock-detail-item">
                        <strong>Average Cost</strong>
                        <div className="stock-detail-value">${stock.average_cost?.toFixed(2)}</div>
                      </div>
                      <div className="stock-detail-item">
                        <strong>Current Price</strong>
                        <div className="stock-detail-value">${stock.current_price?.toFixed(2)}</div>
                      </div>
                      <div className="stock-detail-item">
                        <strong>Total Cost</strong>
                        <div className="stock-detail-value">${stock.total_cost?.toFixed(2)}</div>
                      </div>
                      <div className="stock-detail-item">
                        <strong>Market Value</strong>
                        <div className="stock-detail-value">${stock.total_market_value?.toFixed(2)}</div>
                      </div>
                      <div className="stock-detail-item">
                        <strong>Unrealized P&L</strong>
                        <div className={`stock-detail-value ${stock.unrealized_pl >= 0 ? 'change-up' : 'change-down'}`}>
                          ${stock.unrealized_pl?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="lots-header">Lots Purchased:</h4>
                      <ul className="lots-list">
                        {stock.lots.map((lot) => (
                          <li key={lot.lot_id} className="lot-item">
                            <span className="lot-date">📅 {new Date(lot.purchase_date).toLocaleString()}</span> - 
                            <span className="lot-shares">{lot.quantity} shares</span> @ 
                            <span className="lot-price">${lot.purchase_price?.toFixed(2)}</span>
                            <span className="lot-cost">(Cost: ${lot.cost_basis?.toFixed(2)})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="portfolio-empty">
                <p>No stocks owned yet. Start trading to build your portfolio!</p>
              </div>
            )}
          </div>
        </div>
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
    </div>
  );
};
