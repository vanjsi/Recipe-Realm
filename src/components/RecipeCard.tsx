import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css';

interface Recipe {
  id: number;
  title: string;
  description: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onAddFavorite?: (recipeId: number) => void;
  isFavorite?: boolean;
  isLoggedIn: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onAddFavorite, isFavorite, isLoggedIn }) => {
  return (
    <div className="card">
      <h3 className="card-title">
        <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
      </h3>
      <p className="card-description">{recipe.description}</p>
      <div className="card-details">
        <Link to={`/user-recipes/${recipe.author.id}`} className="author-link">
          {recipe.author.name}
        </Link>
        <p>{new Date(recipe.createdAt).toLocaleDateString()}</p>
      </div>
      {isLoggedIn && onAddFavorite && (
        <button className="favorite-button" onClick={() => onAddFavorite(recipe.id)}>
          {isFavorite ? 'Already in Favorites' : 'Add to Favorites'}
        </button>
      )}
    </div>
  );
};

export default RecipeCard;
