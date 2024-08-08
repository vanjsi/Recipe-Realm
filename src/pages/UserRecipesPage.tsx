import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import './UserRecipesPage.css'; 

interface Author {
  id: number;
  name: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  author: Author;
  createdAt: string;
}

const UserRecipesPage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Set<number>>(new Set());
  const isLoggedIn = !!localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch('/recipes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecipes();
  }, []);

  useEffect(() => {
    if (recipes.length > 0 && authorId) {
      const filtered = recipes.filter(recipe => recipe.author.id === Number(authorId));
      setFilteredRecipes(filtered);
    }
  }, [recipes, authorId]);

  const handleAddFavorite = async (recipeId: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }

      if (favoriteRecipes.has(recipeId)) {
        console.error('Recipe is already in your favorites.');
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

      if (!response.ok) {
        throw new Error(`Failed to add favorite recipe: ${response.statusText}`);
      }

      setFavoriteRecipes(prev => {
        const updatedFavorites = new Set(prev);
        updatedFavorites.add(recipeId);
        return updatedFavorites;
      });
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
    <div className="user-recipes">
      <h1>User's recipes</h1>
      <div className="recipe-container">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onAddFavorite={handleAddFavorite}
              isFavorite={favoriteRecipes.has(recipe.id)}
              isLoggedIn={isLoggedIn}
            />
          ))
        ) : (
          <div>No recipes found for this user.</div>
        )}
      </div>
    </div>
  );
};

export default UserRecipesPage;
