import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import './AllRecipes.css';

interface Author {
  id: number;
  name: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  author: Author;
  createdAt: string;
}

const AllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredCategory, setFilteredCategory] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Set<number>>(new Set());
  const isLoggedIn = !!localStorage.getItem('jwtToken');
  const currentUserId = localStorage.getItem('userId');
  const location = useLocation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const categoryId = urlParams.get('category');

        setFilteredCategory(categoryId ? parseInt(categoryId, 10) : null);

        let url = '/recipes';
        if (categoryId) {
          url += `?categoryId=${categoryId}`;
        }

        const response = await fetch(url);
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
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [location.search]);

  const handleAddFavorite = async (recipeId: number) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('No token found');
    }

    // Proveri da li je recept već u omiljenima
    if (favoriteRecipes.has(recipeId)) {
      setFailureMessage('Recipe is already in your favorites.');
      setSuccessMessage(null);
      return;
    }

    const response = await fetch('/recipes/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipeId }),
    });

    if (response.status === 409) { // 409 Conflict ili status koji server vraća za već postojeći recept
      setFailureMessage('That recipe is already in your favorites.');
      setSuccessMessage(null);
      return;
    }

    if (!response.ok) {
      throw new Error(`Failed to add favorite recipe: ${response.statusText}`);
    }

    setFavoriteRecipes(prev => {
      const updatedFavorites = new Set(prev);
      updatedFavorites.add(recipeId);
      return updatedFavorites;
    });
    setSuccessMessage('Recipe added to favorites successfully!');
    setFailureMessage(null);
  } catch (error) {
    setFailureMessage('Failed to add recipe to favorites.');
    setSuccessMessage(null);
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
    <div className="all-recipes">
      {successMessage && <div className="success-message">{successMessage}</div>}
      {failureMessage && <div className="error-message">{failureMessage}</div>}
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
  );
};

export default AllRecipes;
