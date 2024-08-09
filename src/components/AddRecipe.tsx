import React, { useState, useEffect } from 'react';
import './AddRecipe.css';

interface AddRecipeProps {
  onClose: () => void;
  onSave: (recipe: { title: string; description: string; ingredients: string; steps: string; authorId: number; categoryId: number }) => void;
  initialValues?: {
    title: string;
    description: string;
    ingredients: string;
    steps: string;
    authorId: number;
    categoryId: number;
  };
}

const AddRecipe: React.FC<AddRecipeProps> = ({ onClose, onSave, initialValues }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [authorId, setAuthorId] = useState<number>(1); 
  const [categoryId, setCategoryId] = useState<number>(2); 
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // Učitajte kategorije kada se komponenta učita
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();

    if (initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description);
      setIngredients(initialValues.ingredients);
      setSteps(initialValues.steps);
      setAuthorId(initialValues.authorId);
      setCategoryId(initialValues.categoryId);
    }
  }, [initialValues]);

  const handleSubmit = () => {
    onSave({ title, description, ingredients, steps, authorId, categoryId });
    onClose();
  };

  return (
    <div className="add-recipe-modal">
      <h2>{initialValues ? 'Edit Recipe' : 'Add New Recipe'}</h2>
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
          {categories.map(category => (
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
