import React from 'react';
import './App.css';
import Navbar from './Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import AllRecipes from './AllRecipes';
import RecipeDetail from './RecipeDetail';
import RegistrationPage from './RegistrationPage';
import LoginPage from './LoginPage';
import UserProfile from './UserProfile';
import CategoriesPage from './CategoriesPage';
import SearchResults from './SearchResults';


const App: React.FC = () => {
  return (
    <BrowserRouter basename="/">
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/recipes" element={<AllRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
