import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Notifications.css';

export default ()=> {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5003'); 

    socket.on('adoption-notification', (message) => {
      setNotifications((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Notifications Micro-Frontend</h2>
      {notifications.length === 0 ? (
        <p className="notifications-empty">No notifications yet...</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notif, index) => (
            <li key={index} className="notifications-item">
              <strong>Type:</strong> {notif.type} | <strong>Animal ID:</strong> {notif.animalId} |{' '}
              <strong>User ID:</strong> {notif.userId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
