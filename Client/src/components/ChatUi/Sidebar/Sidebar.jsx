import React, { useEffect, useState } from 'react';
import './sideBar.css';

const Sidebar = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
  const url = 'http://localhost:8080/users'
  fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => setData(data))
  .catch((error) => console.error('Error fetching data:', error));

  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <input type="text" placeholder="Search or start new chat" />
      </div>
      <div className="contacts">
        {data.map((item, index) => (
          <div className="contact-item" key={index}>
            <div className="avatar">{item.name.charAt(0).toUpperCase()}</div>
            <div className="contact-info">
              <h4>{item.name}</h4>
              <p>Last message preview...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
