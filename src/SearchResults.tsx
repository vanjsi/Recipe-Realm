import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './SearchResults.css';

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  categoryId: number;
}

const SearchResults: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const query = new URLSearchParams(useLocation().search).get('query') || '';

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="search-results">
      <h1>Results of search for "{query}"</h1>
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
