import React, { useState } from 'react';
import './navbar.css';
import { FaSearch, FaBars, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ setSearchQuery }) => { // Receive the setSearchQuery function as a prop
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Left Section: Menu Button */}
        <div className="navbar-menu">
          <FaBars className="menu-icon" onClick={toggleMenu} />
        </div>

        {/* Middle Section: Search Icon */}
        <div className="navbar-search">
          <FaSearch className="search-icon" onClick={toggleSearch} />
          <input
            type="text"
            placeholder="Search..."
            className={`search-input ${isSearchActive ? "active" : ""}`}
            autoFocus={isSearchActive}
            onChange={(e) => setSearchQuery(e.target.value)} // Update the search query when typing
          />
        </div>

        {/* Right Section: Profile (Username and Profile Icon) */}
        <div className="navbar-profile">
          <span className="username">Srinivasan</span>
          <FaUserCircle className="profile-icon" />
        </div>
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="side-menu">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/crud">Crud</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
