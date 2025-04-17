import React from 'react';
import GameCard from '../../components/GameCard';
import '../index.css';
import placeholderImages from '../../assets/placeholder';

const GamesPage = () => {
  const games = [
    {
      id: 1,
      title: 'Budget Challenge',
      description: 'Learn to manage your finances by making budget decisions in different scenarios.',
      image: placeholderImages.budgetGame,
      path: '/games/budget',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: 'Financial Escape Room',
      description: 'Solve puzzles and financial riddles to escape the room and master investment concepts.',
      image: placeholderImages.escapeRoom,
      path: '/games/escape-room',
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      title: 'Fake or Finance',
      description: 'Test your knowledge of financial terms and spot financial scams in this quiz game.',
      image: placeholderImages.fakeOrFinance,
      path: '/games/fake-or-finance',
      difficulty: 'Advanced'
    }
  ];

  return (
    <div className="games-page">
      <div className="games-header">
        <h1>Finance Games</h1>
        <p>Learn financial concepts through interactive games</p>
      </div>
      
      <div className="games-container">
        {games.map(game => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            image={game.image}
            path={game.path}
            difficulty={game.difficulty}
          />
        ))}
      </div>
    </div>
  );
};

export default GamesPage; 