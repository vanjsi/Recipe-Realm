import React, { useState, useEffect } from 'react';
import {Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import './PastaPage.css';
import AllRecipes from './AllRecipes';
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

const PastaPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Set<number>>(new Set());
  const isLoggedIn = !!localStorage.getItem('jwtToken');
  const location = useLocation();

  useEffect(() => {
    const fetchPastaRecipes = async () => {
      try {
        const response = await axios.get('/recipes');
        const AllRecipes = response.data;
        const pastaRecipes = AllRecipes.filter((recipe: Recipe) => recipe.categoryId === 5);
        setRecipes(pastaRecipes);
      }catch (error) {
        console.error('Error fetching recipes: ', error);
        setError('Error fetching recipes');
      }finally{
        setLoading(false);
      }
    }
    fetchPastaRecipes();
  }, []);

  const handleAddFavorite = async (recipeId: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }

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
      console.log('Recipe added to favorites');
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
    <div className="pasta-page">
      <h1>Pasta recipes</h1>
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


export default PastaPage;
