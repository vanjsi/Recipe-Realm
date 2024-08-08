import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './RecipeDetail.css';

interface Author {
  id: number;
  name: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  author: Author;
  isAuthor: boolean;
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/recipes/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched recipe:', data); 
        const formattedData = {
          ...data,
          ingredients: data.ingredients.split(','),
          steps: data.steps.split('.').filter((step: string) => step.trim() !== '')
        };

        setRecipe(formattedData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
        console.error('Failed to fetch recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleEdit = () => {
    alert('Edit recipe functionality');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const response = await fetch(`/recipes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        if (response.ok) {
          alert('Recept obrisan');
          navigate('/recipes');
        } else {
          throw new Error('Failed to delete recipe.');
        }
      } catch (error) {
        console.error('Failed to delete recipe:', error);
        alert('An error occurred while deleting the recipe');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.trim()}</li>
        ))}
      </ul>
      <h3>Steps:</h3>
      <ul>
        {recipe.steps.map((step, index) => (
          <li key={index}>{step.trim()}</li>
        ))}
      </ul>
      <p>
        Author: {recipe.author && <Link to={`/profile/${recipe.author.id}`}>{recipe.author.name}</Link>}
      </p>
      {recipe.isAuthor && (
        <div>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
