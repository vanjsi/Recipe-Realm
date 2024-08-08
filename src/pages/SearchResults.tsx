import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import './SearchResults.css';
import RecipeCard from '../components/RecipeCard';

interface Recipe {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
}

const SearchResults: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const query = new URLSearchParams(useLocation().search).get('query') || '';
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Set<number>>(new Set());
  const isLoggedIn = !!localStorage.getItem('jwtToken');
  const location = useLocation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/recipes');
        const allRecipes = response.data;

        
        const filteredRecipes = allRecipes.filter((recipe: Recipe) =>
          recipe.title.toLowerCase().includes(query.toLowerCase())
        );

        setRecipes(filteredRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('An error occurred while searching for the recipe.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [query]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="breakfast-page">
      <h1>Results</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {failureMessage && <div className="error-message">{failureMessage}</div>}
      <div className="recipe-card-container">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onAddFavorite={handleAddFavorite}
              isFavorite={favoriteRecipes.has(recipe.id)}
              isLoggedIn={isLoggedIn}
            />
          ))
        ) : (
          <div>No recipes found for this category.</div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
