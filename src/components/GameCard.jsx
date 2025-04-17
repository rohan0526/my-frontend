import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../game/CSS/index.css';

const GameCard = ({ title, description, image, path, difficulty }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div 
      className={`game-card ${isHovered ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="game-card-image">
        <img src={image} alt={title} />
        <div className={`difficulty-badge ${difficulty.toLowerCase()}`}>{difficulty}</div>
        <div className="game-card-overlay"></div>
      </div>
      <div className="game-card-content">
        <h3 className="game-card-title">{title}</h3>
        <p className="game-card-description">{description}</p>
        <button className="game-card-button">
          {isHovered ? 'Start Playing' : 'Play Now'}
        </button>
      </div>
    </div>
  );
};

export default GameCard; 