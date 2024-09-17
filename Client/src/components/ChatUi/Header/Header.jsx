import React from 'react';
import './header.css';

const Header = () => {
  return (
    <div className="header">
      <h1>Chat App</h1>
      <div className="user-info">
        <span>John Doe</span>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default Header;
