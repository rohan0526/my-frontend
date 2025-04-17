import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../game/CSS/index.css';
import placeholderImages from '../../assets/placeholder';

const BudgetGame = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showLifeEvent, setShowLifeEvent] = useState(false);
  const [lifeEventHandled, setLifeEventHandled] = useState(false);
  const [income] = useState(3000);
  const [success, setSuccess] = useState(false);
  const [budget, setBudget] = useState({
    housing: 0,
    food: 0,
    transportation: 0,
    savings: 0
  });
  
  const [remaining, setRemaining] = useState(income);

  // Function to update budget allocation
  const handleBudgetChange = (category, value) => {
    const newValue = parseInt(value) || 0;
    const oldValue = budget[category];
    const difference = newValue - oldValue;
    
    // Check if we have enough remaining budget
    if (remaining - difference < 0) {
      return;
    }
    
    const newBudget = { ...budget, [category]: newValue };
    setBudget(newBudget);
    setRemaining(remaining - difference);
  };

  // Function to trigger life event after some time in the game
  useEffect(() => {
    if (gameStarted && !showLifeEvent && !lifeEventHandled) {
      const timer = setTimeout(() => {
        setShowLifeEvent(true);
      }, 10000); // Show life event after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showLifeEvent, lifeEventHandled]);

  // Function to handle life event
  const handleLifeEvent = (choice) => {
    if (choice === 'pay') {
      // Pay from emergency savings
      const newBudget = { 
        ...budget, 
        savings: Math.max(0, budget.savings - 300) 
      };
      setBudget(newBudget);
    } else {
      // Add to existing expenses (transportation)
      const newBudget = { 
        ...budget, 
        transportation: budget.transportation + 300 
      };
      setBudget(newBudget);
    }
    
    setShowLifeEvent(false);
    setLifeEventHandled(true);
  };

  // Function to submit and check the budget
  const submitBudget = () => {
    // Basic budget check rules:
    // 1. Must allocate all money
    // 2. At least 20% of income for housing
    // 3. At least 10% for food
    // 4. At least 5% for transportation
    // 5. At least 10% for savings (if life event hasn't depleted it)
    
    const isHousingEnough = budget.housing >= income * 0.2;
    const isFoodEnough = budget.food >= income * 0.1;
    const isTransportationEnough = budget.transportation >= income * 0.05;
    const isSavingsEnough = lifeEventHandled ? true : budget.savings >= income * 0.1;
    const isFullyAllocated = remaining === 0;
    
    const isSuccessful = isHousingEnough && isFoodEnough && 
                         isTransportationEnough && isSavingsEnough && 
                         isFullyAllocated;
    
    setSuccess(isSuccessful);
    setGameEnded(true);
  };

  // Reset the game
  const resetGame = () => {
    setBudget({
      housing: 0,
      food: 0,
      transportation: 0,
      savings: 0
    });
    setRemaining(income);
    setGameEnded(false);
    setShowLifeEvent(false);
    setLifeEventHandled(false);
    setGameStarted(true);
  };

  return (
    <div className="game-page budget-game">
      <div className="game-header">
        <button className="back-button" onClick={() => navigate('/games')}>
          ← Back to Games
        </button>
        <h1>Budget Challenge</h1>
      </div>

      {!gameStarted ? (
        <div className="game-intro">
          <div className="game-intro-content">
            <h2>Welcome to Budget Challenge!</h2>
            <p>
              In this game, you'll be given a monthly income of $3,000 and will need to make 
              budget decisions to reach your financial goals. Make smart choices about 
              spending, saving, and investing to win!
            </p>
            <h3>How to Play:</h3>
            <ol>
              <li>Allocate your $3,000 income to different expense categories.</li>
              <li>Be prepared for unexpected financial events!</li>
              <li>Submit your budget when you're ready.</li>
              <li>You'll need to allocate enough for basics: housing (20%), food (10%), 
              transportation (5%), and savings (10%).</li>
            </ol>
            <button 
              className="start-game-button"
              onClick={() => setGameStarted(true)}
            >
              Start Game
            </button>
          </div>
          <div className="game-intro-image">
            <img src={placeholderImages.budgetGame} alt="Budget Game" />
          </div>
        </div>
      ) : (
        <div className="game-content">
          {gameEnded ? (
            <div className="budget-result">
              <h2>{success ? "Success! Your budget is balanced!" : "Budget needs work..."}</h2>
              <div className="budget-feedback">
                {!success && (
                  <div className="budget-issues">
                    <p>Here's what to fix:</p>
                    <ul>
                      {budget.housing < income * 0.2 && (
                        <li>Housing allocation should be at least ${income * 0.2} (20% of income)</li>
                      )}
                      {budget.food < income * 0.1 && (
                        <li>Food allocation should be at least ${income * 0.1} (10% of income)</li>
                      )}
                      {budget.transportation < income * 0.05 && (
                        <li>Transportation allocation should be at least ${income * 0.05} (5% of income)</li>
                      )}
                      {!lifeEventHandled && budget.savings < income * 0.1 && (
                        <li>Savings allocation should be at least ${income * 0.1} (10% of income)</li>
                      )}
                      {remaining !== 0 && (
                        <li>You must allocate all of your income (${remaining} remaining)</li>
                      )}
                    </ul>
                  </div>
                )}
                {success && (
                  <p>You've created a balanced budget that covers all your necessities and includes savings!</p>
                )}
              </div>
              <div className="budget-summary">
                <h3>Your Budget Allocation:</h3>
                <div className="budget-summary-items">
                  <div className="budget-item">
                    <span>Housing:</span> <b>${budget.housing}</b> ({((budget.housing / income) * 100).toFixed(1)}%)
                  </div>
                  <div className="budget-item">
                    <span>Food:</span> <b>${budget.food}</b> ({((budget.food / income) * 100).toFixed(1)}%)
                  </div>
                  <div className="budget-item">
                    <span>Transportation:</span> <b>${budget.transportation}</b> ({((budget.transportation / income) * 100).toFixed(1)}%)
                  </div>
                  <div className="budget-item">
                    <span>Emergency Savings:</span> <b>${budget.savings}</b> ({((budget.savings / income) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
              <button 
                className="start-game-button"
                onClick={resetGame}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {showLifeEvent && (
                <div className="life-event-overlay">
                  <div className="life-event-popup">
                    <h3>Unexpected Life Event!</h3>
                    <p>You have a sudden medical bill of $300.</p>
                    <p>How will you handle this expense?</p>
                    <div className="life-event-choices">
                      <button onClick={() => handleLifeEvent('pay')}>
                        Pay from Emergency Savings
                      </button>
                      <button onClick={() => handleLifeEvent('add')}>
                        Add to Transportation Expenses (e.g., Uber to hospital)
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <h2>Create Your Monthly Budget</h2>
              <div className="budget-stats">
                <div className="budget-income">
                  <span>Total Income:</span> <b>${income}</b>
                </div>
                <div className={remaining === 0 ? "budget-remaining zero" : "budget-remaining"}>
                  <span>Remaining:</span> <b>${remaining}</b>
                </div>
              </div>
              <div className="budget-form">
                <div className="budget-categories">
                  <div className="budget-category">
                    <label htmlFor="housing">Rent/Housing:</label>
                    <div className="budget-input-group">
                      <span className="currency-symbol">$</span>
                      <input 
                        type="number" 
                        id="housing" 
                        value={budget.housing} 
                        onChange={(e) => handleBudgetChange('housing', e.target.value)}
                        min="0"
                        max={income}
                      />
                    </div>
                    <div className="budget-hint">Recommended: at least 20% of income</div>
                  </div>
                  <div className="budget-category">
                    <label htmlFor="food">Food:</label>
                    <div className="budget-input-group">
                      <span className="currency-symbol">$</span>
                      <input 
                        type="number" 
                        id="food" 
                        value={budget.food} 
                        onChange={(e) => handleBudgetChange('food', e.target.value)}
                        min="0"
                        max={income}
                      />
                    </div>
                    <div className="budget-hint">Recommended: at least 10% of income</div>
                  </div>
                  <div className="budget-category">
                    <label htmlFor="transportation">Transportation:</label>
                    <div className="budget-input-group">
                      <span className="currency-symbol">$</span>
                      <input 
                        type="number" 
                        id="transportation" 
                        value={budget.transportation} 
                        onChange={(e) => handleBudgetChange('transportation', e.target.value)}
                        min="0"
                        max={income}
                      />
                    </div>
                    <div className="budget-hint">Recommended: at least 5% of income</div>
                  </div>
                  <div className="budget-category">
                    <label htmlFor="savings">Emergency Savings:</label>
                    <div className="budget-input-group">
                      <span className="currency-symbol">$</span>
                      <input 
                        type="number" 
                        id="savings" 
                        value={budget.savings} 
                        onChange={(e) => handleBudgetChange('savings', e.target.value)}
                        min="0"
                        max={income}
                      />
                    </div>
                    <div className="budget-hint">Recommended: at least 10% of income</div>
                  </div>
                </div>
                <button 
                  className="submit-budget-button"
                  onClick={submitBudget}
                  disabled={remaining > 0}
                >
                  Submit Budget
                </button>
                {remaining > 0 && (
                  <p className="budget-warning">You still have ${remaining} to allocate.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetGame; 