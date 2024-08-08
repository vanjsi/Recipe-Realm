import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import AddRecipe from '../components/AddRecipe';

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  authorId: number;
  categoryId: number;
  createdAt?: string;
  author?: {
    id: number;
    name: string;
  };
}

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'myRecipes' | 'favoriteRecipes'>('myRecipes');
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const isLoggedIn = !!localStorage.getItem('jwtToken'); // Check if user is logged in

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }

      const myRecipesResponse = await fetch('/recipes/user-recipes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const favoriteRecipesResponse = await fetch('/recipes/favorite', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!myRecipesResponse.ok || !favoriteRecipesResponse.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const myRecipesData = await myRecipesResponse.json();
      const favoriteRecipesData = await favoriteRecipesResponse.json();
      setMyRecipes(myRecipesData);
      setFavoriteRecipes(favoriteRecipesData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setMessage('Failed to fetch recipes.');
      setMessageType('error');
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleAddRecipe = async (recipe: { title: string; description: string; ingredients: string; steps: string; authorId: number; categoryId: number }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error('Failed to add recipe');
      }

      const newRecipe = await response.json();
      setMyRecipes([...myRecipes, newRecipe]);
      setMessage('Recipe added successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error adding recipe:', error);
      setMessage('Failed to add recipe.');
      setMessageType('error');
    }
  };

  const handleEditRecipe = async (updatedRecipe: { title: string; description: string; ingredients: string; steps: string }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token || !editingRecipe) {
        throw new Error('No token found or no recipe to edit');
      }

      const response = await fetch(`/recipes/${editingRecipe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error('Failed to edit recipe');
      }

      const editedRecipe = await response.json();
      setMyRecipes(myRecipes.map(recipe => recipe.id === editingRecipe.id ? editedRecipe : recipe));
      setMessage('Recipe updated successfully!');
      setMessageType('success');
      setEditingRecipe(null);
    } catch (error) {
      console.error('Error editing recipe:', error);
      setMessage('Failed to edit recipe.');
      setMessageType('error');
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`/recipes/${recipeId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          setMyRecipes(myRecipes.filter(recipe => recipe.id !== recipeId));
          setMessage('Recipe deleted successfully!');
          setMessageType('success');
        } else {
          throw new Error('Failed to delete recipe');
        }
      } catch (error) {
        console.error('Error deleting recipe:', error);
        setMessage('Failed to delete recipe.');
        setMessageType('error');
      }
    }
  };

  const handleFavoriteRecipe = async (recipeId: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('/recipes/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ recipeId }),
      });

      if (response.ok) {
        setFavoriteRecipes([...favoriteRecipes, { id: recipeId } as Recipe]);
        setMessage('Recipe added to favorites!');
        setMessageType('success');
      } else {
        throw new Error('Failed to add recipe to favorites');
      }
    } catch (error) {
      console.error('Error adding recipe to favorites:', error);
      setMessage('Failed to add recipe to favorites.');
      setMessageType('error');
    }
  };

  const handleRemoveFavorite = async (recipeId: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('/recipes/favorite', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ recipeId }),
      });

      if (response.ok) {
        setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.id !== recipeId));
        setMessage('Recipe removed from favorites!');
        setMessageType('success');
      } else {
        throw new Error('Failed to remove recipe from favorites');
      }
    } catch (error) {
      console.error('Error removing recipe from favorites:', error);
      setMessage('Failed to remove recipe from favorites.');
      setMessageType('error');
    }
  };

  const handleShowAddRecipe = () => {
    setEditingRecipe(null); 
    setShowModal(true);    
  };

  const handleShowEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowModal(true);
  };

  return (
    <div className="user-profile">
      {message && (
        <div className={`notification ${messageType}`}>
          {message}
        </div>
      )}

      <div className="left-sidebar">
        <button
          className={`my-recipes-button ${activeTab === 'myRecipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('myRecipes')}
        >
          My Recipes
        </button>
        <button 
          className={`favorite-recipes-button ${activeTab === 'favoriteRecipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('favoriteRecipes')}
        >
          Favorite Recipes
        </button>
      </div>

      <div className="content">
        {activeTab === 'myRecipes' && (
          <>
            {loadingRecipes ? (
              <p>Loading...</p>
            ) : (
              <div className="recipe-cards">
                {myRecipes.map(recipe => (
                  <div className="card" key={recipe.id}>
                    <h3 className="card-title">
                      <a href={`/recipes/${recipe.id}`}>{recipe.title}</a>
                    </h3>
                    <p className="card-description">{recipe.description}</p>
                    <div className="card-details">
                      <a href={`/profile/${recipe.authorId}`} className="author-link">
                        {recipe.author?.name}
                      </a>
                      <p>{new Date(recipe.createdAt || '').toLocaleDateString()}</p>
                    </div>
                    <button className="edit-button" onClick={() => handleShowEditRecipe(recipe)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                    <button 
                      className={`favorite-button ${favoriteRecipes.some(r => r.id === recipe.id) ? 'favorited' : ''}`}
                      onClick={() => handleFavoriteRecipe(recipe.id)}
                    >
                      {favoriteRecipes.some(r => r.id === recipe.id) ? 'Remove from favorite' : 'Favorite'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'favoriteRecipes' && (
          <>
            {loadingRecipes ? (
              <p>Loading...</p>
            ) : (
              <div className="recipe-cards">
                {favoriteRecipes.map(recipe => (
                  <div className="card" key={recipe.id}>
                    <h3 className="card-title">
                      <a href={`/recipes/${recipe.id}`}>{recipe.title}</a>
                    </h3>
                    <p className="card-description">{recipe.description}</p>
                    <div className="card-details">
                      <a href={`/profile/${recipe.authorId}`} className="author-link">
                        {recipe.author?.name}
                      </a>
                      <p>{new Date(recipe.createdAt || '').toLocaleDateString()}</p>
                    </div>
                    <button 
                      className={`favorite-button ${favoriteRecipes.some(r => r.id === recipe.id) ? 'favorited' : ''}`}
                      onClick={() => handleRemoveFavorite(recipe.id)}
                    >
                      Remove from favorite
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="right-sidebar">
        <button className="add-recipe-button" onClick={handleShowAddRecipe}>Add new recipe</button>
        {showModal && (
          <AddRecipe
            onClose={() => setShowModal(false)}
            onSave={editingRecipe ? handleEditRecipe : handleAddRecipe}
            initialValues={editingRecipe ? {
              title: editingRecipe.title,
              description: editingRecipe.description,
              ingredients: editingRecipe.ingredients,
              steps: editingRecipe.steps,
              authorId: editingRecipe.authorId,
              categoryId: editingRecipe.categoryId
            } : undefined}
          />
        )}

      </div>
    </div>
  );
};

export default UserProfile;