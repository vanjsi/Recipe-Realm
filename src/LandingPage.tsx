import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

interface Recipe {
  id: number;
  title: string;
  description: string;
  author: {
    id: number;
    name: string;
  };
  date: string;
}

const LandingPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = !!localStorage.getItem('jwtToken');
  const currentUserId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/recipes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
        console.error('Failed to fetch recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleAddFavorite = async (recipeId: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('/recipes/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add favorite recipe: ${response.statusText}`);
      }

      console.log('Recipe added to favorites');
    } catch (error) {
      console.error('Failed to add favorite recipe:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="landing-page">
      <div className="card-container">
        {recipes.map((recipe) => (
          <div className="card" key={recipe.id}>
            <div className="card-content">
              <h3 className="card-title">
                <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
              </h3>
              <p className="card-description">{recipe.description}</p>
              <div className="card-details">
                <Link to={`/profile/${recipe.author.id}`} className="author-link">
                  {recipe.author.name}
                </Link>
                <p>{recipe.date}</p>
              </div>
              {isLoggedIn && (
                <button className="favorite-button" onClick={() => handleAddFavorite(recipe.id)}>Favorite</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
