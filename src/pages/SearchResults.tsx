import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import './SearchResults.css';

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
    <div className="all-recipes">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div className="card" key={recipe.id}>
            <h3 className="card-title">
              <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
            </h3>
            <p className="card-description">{recipe.description}</p>
            <div className="card-details">
              <Link to={`/profile/${recipe.author.id}`} className="author-link">
                {recipe.author.name}
              </Link>
              <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
            </div>
            {isLoggedIn && (
              <button className="favorite-button" onClick={() => handleAddFavorite(recipe.id)}>
                Add to Favorites
              </button>
            )}
          </div>
        ))
      ) : (
        <div>No recipes found for this category.</div>
      )}
    </div>
  );
};

export default SearchResults;
