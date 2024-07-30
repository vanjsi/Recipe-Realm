import React, { useState, useEffect } from 'react';
import './AddRecipe.css'; 

interface AddRecipeProps {
  onClose: () => void;
  onSave: (recipe: { title: string; description: string; ingredients: string; steps: string; authorId: number; categoryId: number }) => void;
}

const AddRecipe: React.FC<AddRecipeProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [authorId] = useState(Number(localStorage.getItem('userId')) || 1);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
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

    onSave({ title, description, ingredients, steps, authorId, categoryId });
    onClose();
  };

  return (
    <div className="add-recipe-modal">
      <h2>Add new recipe</h2>
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
        Category:
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

export default AddRecipe;
