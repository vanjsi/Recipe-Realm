import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('jwtToken');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="navbar-logo-link">
          <div className="logo elipse">Recipe Realm</div>
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">All Recipes</Link></li>
        <li><Link to="/breakfast">Breakfast</Link></li>
        <li><Link to="/lunch">Lunch</Link></li>
        <li><Link to="/dinner">Dinner</Link></li>
        <li><Link to="/drink">Drink</Link></li>
        <li><Link to="/dessert">Dessert</Link></li>
        <li><Link to="/pasta">Pasta</Link></li>
        {isLoggedIn && userId && (
          <li><Link to="/profile">My Profile</Link></li>
        )}
      </ul>
      <div className="navbar-search">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="navbar-buttons">
        {isLoggedIn ? (
          <button className="btn" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">
              <button className="btn">Login</button>
            </Link>
            <Link to="/registration">
              <button className="btn btn-primary">Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
