import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa'; 

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
  onRemoveFavorite?: (recipeId: number) => void;
  isFavorite?: boolean;
  isLoggedIn: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onAddFavorite, onRemoveFavorite, isFavorite, isLoggedIn }) => {
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
      {isLoggedIn && (
        <div
          className={`favorite-icon ${isFavorite ? 'favorite' : ''}`}
          onClick={() => isFavorite ? onRemoveFavorite?.(recipe.id) : onAddFavorite?.(recipe.id)}
        >
          {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
