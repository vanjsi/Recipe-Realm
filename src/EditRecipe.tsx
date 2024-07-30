import React, { useState, useEffect } from 'react';
import './EditRecipe.css'; 

interface EditRecipeProps {
  recipe: {
    id: number;
    title: string;
    description: string;
    ingredients: string;
    steps: string;
    categoryId: number;
  };
  onSave: (updatedRecipe: { title: string; description: string; ingredients: string; steps: string; categoryId: number }) => void;
  onClose: () => void;
}

const EditRecipe: React.FC<EditRecipeProps> = ({ recipe, onSave, onClose }) => {
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [steps, setSteps] = useState(recipe.steps);
  const [categoryId, setCategoryId] = useState(recipe.categoryId);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = () => {
    if (categoryId === undefined) {
      alert('Please select a category.');
      return;
    }

    onSave({ title, description, ingredients, steps, categoryId });
    onClose();
  };

  return (
    <div className="edit-recipe-modal">
      <h2>Edit recipe</h2>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Ingredients:
        <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
      </label>
      <label>
        Steps:
        <textarea value={steps} onChange={(e) => setSteps(e.target.value)} />
      </label>
      <label>
        Categories:
        <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
          <option value="" disabled>Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <button className="save-button" onClick={handleSubmit}>Save</button>
      <button className="cancel-button" onClick={onClose}>Close</button>
    </div>
  );
};

export default EditRecipe;
