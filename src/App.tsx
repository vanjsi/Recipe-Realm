import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AllRecipes from './pages/AllRecipes';
import RecipeDetail from './components/RecipeDetail';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import UserProfile from './pages/UserProfile';
import SearchResults from './pages/SearchResults';
import BreakfastPage from './pages/BreakfastPage';
import LunchPage from './pages/LunchPage';
import DinnerPage from './pages/DinnerPage';
import DrinkPage from './pages/DrinkPage';
import DessertPage from './pages/DessertPage';
import PastaPage from './pages/PastaPage';
import UserRecipesPage from './pages/UserRecipesPage';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/">
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<AllRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/breakfast" element={<BreakfastPage />} />
          <Route path="/lunch" element={<LunchPage />} />
          <Route path="/dinner" element={<DinnerPage />} />
          <Route path="/drink" element={<DrinkPage />} />
          <Route path="/dessert" element={<DessertPage />} />
          <Route path="/pasta" element={<PastaPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/user-recipes/:authorId" element={<UserRecipesPage/>} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
