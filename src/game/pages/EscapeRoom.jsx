import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../game/CSS/index.css';
import placeholderImages from '../../assets/placeholder';

const EscapeRoom = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  
  // Correct answer (calculated: $1000 * (1 + 0.05)^3 = $1157.63)
  const correctAnswer = 1157.63;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAnswer = parseFloat(userAnswer);
    
    if (Math.abs(parsedAnswer - correctAnswer) < 0.01) {
      // Answer is correct (within a small margin of error)
      setIsSuccess(true);
      setHasError(false);
    } else {
      // Answer is wrong
      setHasError(true);
    }
  };
  
  const resetGame = () => {
    setUserAnswer('');
    setShowHint(false);
    setIsSuccess(false);
    setHasError(false);
    setShowFormula(false);
  };

  return (
    <div className="game-page escape-room-game">
      <div className="game-header">
        <button className="back-button" onClick={() => navigate('/games')}>
          ← Back to Games
        </button>
        <h1>Financial Escape Room</h1>
      </div>

      {!gameStarted ? (
        <div className="game-intro">
          <div className="game-intro-content">
            <h2>Welcome to the Financial Escape Room!</h2>
            <p>
              You've been locked in a virtual room filled with financial puzzles and riddles.
              Solve them all to escape and become a financial expert!
            </p>
            <h3>How to Play:</h3>
            <ol>
              <li>You'll be presented with a financial puzzle.</li>
              <li>Calculate the answer and enter it in the input field.</li>
              <li>If you're correct, you'll unlock the next level.</li>
              <li>If you need help, you can use the hint button, but try to solve it on your own first!</li>
            </ol>
            <button 
              className="start-game-button"
              onClick={() => setGameStarted(true)}
            >
              Enter the Room
            </button>
          </div>
          <div className="game-intro-image">
            <img src={placeholderImages.escapeRoom} alt="Escape Room" />
          </div>
        </div>
      ) : (
        <div className="game-content escape-room-content">
          {!isSuccess ? (
            <div className="puzzle-container">
              <div className="escape-room-scene">
                <div className="door-container">
                  <div className="escape-door">
                    <div className="door-lock"></div>
                  </div>
                </div>
                <div className="puzzle-board">
                  <h2>Level 1: Compound Interest Puzzle</h2>
                  <p className="puzzle-description">
                    The door is locked with a numeric keypad. Calculate the following to unlock it:
                  </p>
                  <div className="puzzle-question">
                    <p>
                      You invest $1000 at 5% interest compounded annually for 3 years.
                      <br />
                      What's the final amount? (Round to 2 decimal places)
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="answer-form">
                    <div className="answer-input-group">
                      <span className="currency-symbol">$</span>
                      <input 
                        type="number" 
                        value={userAnswer} 
                        onChange={(e) => {
                          setUserAnswer(e.target.value);
                          setHasError(false);
                        }}
                        placeholder="Enter your answer"
                        step="0.01"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="submit-answer-button"
                    >
                      Submit Answer
                    </button>
                  </form>
                  
                  {hasError && (
                    <div className="error-message">
                      <p>That's not correct. Try again!</p>
                    </div>
                  )}
                  
                  <div className="hint-section">
                    <button 
                      className="hint-button"
                      onClick={() => setShowHint(!showHint)}
                    >
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </button>
                    
                    {showHint && (
                      <div className="hint-content">
                        <p>
                          Use the compound interest formula: A = P(1 + r)^t
                        </p>
                        <p>
                          Where:
                          <ul>
                            <li>A = Final amount</li>
                            <li>P = Principal (initial investment)</li>
                            <li>r = Interest rate (as a decimal)</li>
                            <li>t = Time (in years)</li>
                          </ul>
                        </p>
                        <button 
                          className="show-formula-button"
                          onClick={() => setShowFormula(!showFormula)}
                        >
                          {showFormula ? "Hide Calculation" : "Show Calculation Example"}
                        </button>
                        
                        {showFormula && (
                          <div className="formula-calculation">
                            <p>A = $1000 × (1 + 0.05)³</p>
                            <p>A = $1000 × (1.05)³</p>
                            <p>A = $1000 × 1.157625</p>
                            <p>A = $1157.63</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="success-container">
              <div className="success-animation">
                <div className="door-unlocked">
                  <div className="door-open"></div>
                  <div className="lock-open"></div>
                </div>
                <h2 className="success-heading">Door Unlocked!</h2>
                <p className="success-message">
                  Congratulations! You've solved the compound interest puzzle and unlocked the first door.
                </p>
                <div className="learning-note">
                  <h3>Financial Learning:</h3>
                  <p>
                    Compound interest is a powerful concept in investing. It's the interest you earn 
                    on your initial investment (principal) plus the interest you've already earned. 
                    This is how investments grow over time, and it's one of the most important 
                    concepts in personal finance!
                  </p>
                </div>
                <div className="next-level-section">
                  <p>Next levels coming soon...</p>
                  <button 
                    className="start-game-button"
                    onClick={resetGame}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EscapeRoom; 