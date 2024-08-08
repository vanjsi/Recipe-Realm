import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CategoriesPage.css';

interface Category {
  id: number;
  name: string;
  colorClass: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  categoryId: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        const categoriesWithColors = response.data.map((category: Category) => ({
          ...category,
          colorClass: getCategoryClass(category.name),
        }));
        setCategories(categoriesWithColors);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/recipes');
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Error fetching recipes');
      }
    };

    const loadData = async () => {
      try {
        await Promise.all([fetchCategories(), fetchRecipes()]);
      } catch (error) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const filteredRecipes = selectedCategory
    ? recipes.filter((recipe) => recipe.categoryId === selectedCategory)
    : [];

  const getCategoryClass = (categoryName: string): string => {
    switch (categoryName.toLowerCase()) {
      case 'ručak': return 'category-lunch';
      case 'večera': return 'category-dinner';
      case 'doručak': return 'category-breakfast';
      case 'pice': return 'category-drinks';
      case 'pasta': return 'category-pasta';
      case 'desert': return 'category-dessert';
      default: return 'category-default';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="categories-page">
      <h1>Categories</h1>
      <ul className="categories-list">
        {categories.map((category) => (
          <li
            key={category.id}
            className={category.colorClass}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>

      {selectedCategory && (
        <div className="recipes-list">
          <h2>Recepti za {categories.find(c => c.id === selectedCategory)?.name}</h2>
          {filteredRecipes.length === 0 ? (
            <p>No recipes found in this category.</p>
          ) : (
            <ul>
              {filteredRecipes.map((recipe) => (
                <li key={recipe.id}>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
