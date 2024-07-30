import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  date: string;
  createdAt: string;
  updatedAt: string;
}

const AllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredCategory, setFilteredCategory] = useState<number | null>(null);

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
            {recipe.author.id.toString() === currentUserId && (
              <div>
                <button onClick={() => alert('Edit recipe functionality')}>Edit</button>
                <button onClick={() => alert('Delete recipe functionality')}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No recipes found for this category.</div>
      )}
    </div>
  );
};

export default AllRecipes;
