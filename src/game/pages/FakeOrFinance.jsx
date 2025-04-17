import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../game/CSS/index.css';
import placeholderImages from '../../assets/placeholder';

const FakeOrFinance = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  
  // Questions array with real and fake financial terms
  const questions = [
    {
      term: "Contango",
      isReal: true,
      definition: "A market condition where futures prices are higher than the current spot price, often due to costs of carry.",
      fakeExplanation: null
    },
    {
      term: "Financial Osmosis",
      isReal: false,
      definition: null,
      fakeExplanation: "This is a fake term that might sound real. There's no financial concept called 'Financial Osmosis'."
    },
    {
      term: "Bollinger Bands",
      isReal: true,
      definition: "A technical analysis tool that creates a band of three lines which are calculated by using standard deviation and a simple moving average.",
      fakeExplanation: null
    },
    {
      term: "Hyperflation Resistance Index",
      isReal: false,
      definition: null,
      fakeExplanation: "This is a made-up term. While there's hyperinflation and inflation resistance, there's no such official index."
    },
    {
      term: "Dead Cat Bounce",
      isReal: true,
      definition: "A temporary recovery in stock prices after a substantial fall, caused by investors who buy at the low point thinking the worst is over.",
      fakeExplanation: null
    },
    {
      term: "Fiscal Velocity Transfer",
      isReal: false,
      definition: null,
      fakeExplanation: "This sounds technical but is a fake term. There's no concept in finance called 'Fiscal Velocity Transfer'."
    },
    {
      term: "Monte Carlo Simulation",
      isReal: true,
      definition: "A computerized mathematical technique that allows people to account for risk in quantitative analysis and decision making.",
      fakeExplanation: null
    },
    {
      term: "Quantum Finance Principle",
      isReal: false,
      definition: null,
      fakeExplanation: "While 'quantum finance' is an emerging field, there's no established 'Quantum Finance Principle'."
    },
    {
      term: "EBITDA",
      isReal: true,
      definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization - a measure of a company's overall financial performance.",
      fakeExplanation: null
    },
    {
      term: "Triple Leverage Arbitrage",
      isReal: false,
      definition: null,
      fakeExplanation: "This term was made up. While there are leveraged investments and arbitrage strategies, this specific term isn't a standard financial concept."
    }
  ];
  
  // Functions to handle game logic
  const handleAnswer = (userAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = userAnswer === currentQuestion.isReal;
    
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
    
    setShowAnswer(true);
  };
  
  const nextQuestion = () => {
    // Hide the answer explanation
    setShowAnswer(false);
    
    // Move to the next question or end game
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameFinished(true);
    }
  };
  
  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
    setIsCorrect(false);
    setGameFinished(false);
  };

  return (
    <div className="game-page fake-or-finance-game">
      <div className="game-header">
        <button className="back-button" onClick={() => navigate('/games')}>
          ← Back to Games
        </button>
        <h1>Fake or Finance</h1>
      </div>

      {!gameStarted ? (
        <div className="game-intro">
          <div className="game-intro-content">
            <h2>Welcome to Fake or Finance!</h2>
            <p>
              Test your knowledge of financial terms and learn to identify financial
              scams and misleading information in this fast-paced quiz game.
            </p>
            <h3>How to Play:</h3>
            <ol>
              <li>You'll be shown a financial term or concept.</li>
              <li>Click "Real" if you think it's a legitimate finance concept or "Fake" if you think it's made up.</li>
              <li>Get immediate feedback on your answers.</li>
              <li>Try to get the highest score possible out of 10 questions!</li>
            </ol>
            <button 
              className="start-game-button"
              onClick={() => setGameStarted(true)}
            >
              Start Quiz
            </button>
          </div>
          <div className="game-intro-image">
            <img src={placeholderImages.fakeOrFinance} alt="Fake or Finance" />
          </div>
        </div>
      ) : (
        <div className="game-content fake-finance-content">
          {!gameFinished ? (
            <div className="quiz-container">
              <div className="quiz-progress">
                <div className="question-counter">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="score-display">
                  Score: {score}
                </div>
              </div>
              
              <div className="term-display">
                <div className="term-card">
                  <h2>{questions[currentQuestionIndex].term}</h2>
                  <p>Is this a real financial term?</p>
                  
                  {!showAnswer && (
                    <div className="answer-buttons">
                      <button 
                        className="real-button"
                        onClick={() => handleAnswer(true)}
                      >
                        Real
                      </button>
                      <button 
                        className="fake-button"
                        onClick={() => handleAnswer(false)}
                      >
                        Fake
                      </button>
                    </div>
                  )}
                  
                  {showAnswer && (
                    <div className={`answer-reveal ${isCorrect ? 'correct' : 'incorrect'}`}>
                      <h3>
                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                      </h3>
                      <p>
                        {questions[currentQuestionIndex].term} is {questions[currentQuestionIndex].isReal ? 'REAL' : 'FAKE'}!
                      </p>
                      <div className="term-explanation">
                        {questions[currentQuestionIndex].isReal ? 
                          questions[currentQuestionIndex].definition : 
                          questions[currentQuestionIndex].fakeExplanation
                        }
                      </div>
                      <button 
                        className="next-question-button"
                        onClick={nextQuestion}
                      >
                        Next Question
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="quiz-results">
              <h2>Quiz Complete!</h2>
              
              <div className="final-score">
                <div className="score-circle">
                  <span className="score-number">{score}</span>
                  <span className="score-total">/{questions.length}</span>
                </div>
                <p className="score-label">Your Score</p>
              </div>
              
              <div className="score-message">
                {score === questions.length ? (
                  <p>Perfect score! You're a financial expert!</p>
                ) : score >= questions.length * 0.7 ? (
                  <p>Great job! You know your financial terms well.</p>
                ) : score >= questions.length * 0.5 ? (
                  <p>Not bad! You have a decent understanding of finance.</p>
                ) : (
                  <p>Keep learning! Financial literacy is a journey.</p>
                )}
              </div>
              
              <div className="game-actions">
                <button 
                  className="restart-game-button"
                  onClick={restartGame}
                >
                  Play Again
                </button>
                <button 
                  className="back-to-games-button"
                  onClick={() => navigate('/games')}
                >
                  Back to Games
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FakeOrFinance; 