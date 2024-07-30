import React, { useState } from 'react';
import './UserProfile.css';
import AddRecipe from './AddRecipe';
import EditRecipe from './EditRecipe';

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  authorId: number;
  categoryId: number;
}

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'myRecipes' | 'favoriteRecipes'>('myRecipes');
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState('');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const fetchRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('There is no token');
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

      if (!myRecipesResponse.ok) {
        throw new Error(`Failed to download recipes: ${myRecipesResponse.statusText}`);
      }
      if (!favoriteRecipesResponse.ok) {
        throw new Error(`Failed to download favorite recipes: ${favoriteRecipesResponse.statusText}`);
      }

      const myRecipesData = await myRecipesResponse.json();
      const favoriteRecipesData = await favoriteRecipesResponse.json();

      setMyRecipes(myRecipesData);
      setFavoriteRecipes(favoriteRecipesData);
    } catch (error) {
      console.error('Failed to download recipes:', error);
      setMessage('Failed to download recipes.');
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleAddRecipe = async (recipe: { title: string; description: string; ingredients: string; steps: string; authorId: number; categoryId: number }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('There is no token');
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
        throw new Error(`Failed to add recipe: ${response.statusText}`);
      }
  
      const newRecipe = await response.json();
      setMyRecipes([...myRecipes, newRecipe]);
      setMessage('Recipe added successfully!');
    } catch (error) {
      console.error('Failed to add recipe:', error);
      setMessage('Failed to add recipe.');
    }
  };

  const handleEditRecipe = async (updatedRecipe: { title: string; description: string; ingredients: string; steps: string }) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('There is no token');
      }

      if (!editingRecipe) {
        throw new Error('Recipe for editing not found.');
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
        const errorData = await response.json();
        throw new Error(`Failed to edit recipe: ${response.statusText}, ${errorData.message}`);
      }

      const editedRecipe = await response.json();
      setMyRecipes(myRecipes.map(recipe => (recipe.id === editingRecipe.id ? editedRecipe : recipe)));
      setMessage('Recipe modified successfully!');
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to edit recipe:', error);
      setMessage('Failed to edit recipe.');
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('There is no token');
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
        } else {
          throw new Error(`Failed to delete recipe: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Failed to delete recipe:', error);
        setMessage('Failed to delete recipe.');
      }
    }
  };

  const handleFavoriteRecipe = async (recipeId: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('There is no token');
      }
  
      const response = await fetch(`/recipes/favorite/${recipeId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add recipe to favorite: ${response.statusText}`);
      }
  
      const updatedFavorites = await response.json();
      setFavoriteRecipes(updatedFavorites);
      setMessage('Recept je dodan u omiljene!');
    } catch (error) {
      console.error('Failed to add recipe to favorite:', error);
      setMessage('Failed to add recipe to favorite.');
    }
  };

  const handleRemoveFromFavorites = async (recipeId: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('There is no token');
      }
  
      const response = await fetch('/recipes/favorite', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ recipeId }) 
      });
  
      if (!response.ok) {
        throw new Error(`Failed to remove recipe from favorite: ${response.statusText}`);
      }
  
      const updatedFavorites = await response.json();
      
      // Ažurirajte stanje favoriteRecipes
      setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.id !== recipeId));
      
      setMessage('Reciped removed from favorite!');
    } catch (error) {
      console.error('Failed to remove recipe from favorite:', error);
      setMessage('Failed to remove recipe from favorite.');
    }
  };

  return (
    <div className="user-profile">
      <div className="tabs">
        <button 
          className={`my-recipes ${activeTab === 'myRecipes' ? 'active' : ''}`} 
          onClick={() => {
            setActiveTab('myRecipes');
            fetchRecipes();
          }}
        >
          My recipes
        </button>
        <button 
          className={`favorite-recipes ${activeTab === 'favoriteRecipes' ? 'active' : ''}`} 
          onClick={() => {
            setActiveTab('favoriteRecipes');
            fetchRecipes();
          }}
        >
          Favorite recipes
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'myRecipes' && (
          <>
            <button 
              className="add-recipe-button"
              onClick={() => setShowModal(true)}
            >
              Add recipe
            </button>
            {showModal && (
              <AddRecipe 
                onClose={() => setShowModal(false)}
                onSave={handleAddRecipe}
              />
            )}
            {showEditModal && editingRecipe && (
              <EditRecipe
                recipe={editingRecipe}
                onClose={() => setShowEditModal(false)}
                onSave={handleEditRecipe}
              />
            )}
            <div className="recipe-list">
              {loadingRecipes ? (
                <p>Loading...</p>
              ) : (
                myRecipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-item">
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                    <button className="edit-button" onClick={() => {
                      setEditingRecipe(recipe);
                      setShowEditModal(true);
                    }}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {activeTab === 'favoriteRecipes' && (
          <div className="recipe-list">
            {loadingRecipes ? (
              <p>Loading favorite recipes...</p>
            ) : (
              favoriteRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-item">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                  <button className="remove-favorite-button" onClick={() => handleRemoveFromFavorites(recipe.id)}>Remove from favorite</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
