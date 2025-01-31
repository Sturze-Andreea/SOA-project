import React, { useEffect, useState } from 'react';
import './Analytics.css';

export default () =>  {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5002/events')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error('Error fetching events:', err));
  }, []);

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Analytics Micro-Frontend</h2>
      <div className="analytics-content">
        <h3>Recent Events</h3>
        {events.length === 0 ? (
          <p className="analytics-empty">No events found.</p>
        ) : (
          <ul className="analytics-list">
            {events.map((event, index) => (
              <li key={index} className="analytics-list-item">
                <strong>Animal ID:</strong> {event.animalId} | <strong>User ID:</strong> {event.userId} |{' '}
                <strong>Type:</strong> {event.eventType} | <strong>Timestamp:</strong>{' '}
                {new Date(event.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
