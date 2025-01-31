import React, { useEffect, useState } from 'react';
import './Adoption.css';
import Login from './Login';

export default function Adoption() {
  const [token, setToken] = useState(localStorage.getItem('adoption_token') || '');
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '');
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('adoption_token', token);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      async function fetchAnimals() {
        try {
          const response = await fetch('http://localhost:5000/api/animals');
          const data = await response.json();
          setAnimals(data);
        } catch (error) {
          console.error('Error fetching animals:', error);
        }
      }
      fetchAnimals();
    }
  }, [token]);

  async function handleAdoptionSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/adoption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ animalId: selectedAnimal, userId: user._id }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Adoption request submitted successfully!');
      } else {
        setMessage(data.message || 'Error submitting adoption request.');
      }
    } catch (error) {
      setMessage('Network error while submitting adoption request.');
    }
  }

  function handleLogout() {
    setToken('');
    setUser('');
    localStorage.removeItem('adoption_token');
    localStorage.removeItem('user');
  }

  if (!token) {
    return <Login onLoginSuccess={(token, userData) => {
      setToken(token);
      setUser(userData);
    }} />;
  }

  return (
    <div className="adoption-container">
      <h2 className="adoption-title">Adoption Micro-Frontend</h2>
      <p>Logged in user: {user?.username}</p>

      <form className="adoption-form" onSubmit={handleAdoptionSubmit}>
        <label>
          Select Animal:
          <select
            value={selectedAnimal}
            onChange={(e) => setSelectedAnimal(e.target.value)}
            required
          >
            <option value="">-- Choose an Animal --</option>
            {animals.map((animal) => (
              <option key={animal._id} value={animal._id}>
                {animal.name} (ID: {animal._id})
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Submit Adoption Request</button>
      </form>
      {message && <p className="adoption-message">{message}</p>}

      <div className="animal-list">
        <h3>Available Animals</h3>
        <ul>
          {animals.map((animal) => (
            <li key={animal._id} className="animal-card">
              <h4>{animal.name}</h4>
              <p>Description: {animal.description}</p>
              <p><img width="200" src={animal.image}/></p>
              <p>Age: {animal.age}</p>
              <p>Breed: {animal.breed}</p>
            </li>
          ))}
        </ul>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
