import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [story, setStory] = useState([]);
  const [word, setWord] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    const response = await axios.get('https://raw.githubusercontent.com/hstottdev/open-source-novel/refs/heads/main/data/story-data.json');
    setStory(response.data);
    setContributors(response.data.map(entry => entry.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ipResponse = await axios.get('https://api.ipify.org?format=json');
    const ip = ipResponse.data.ip;
    const today = new Date().toISOString().split('T')[0];

    const existingEntry = story.find(entry => entry.ip === ip && entry.date === today);
    if (existingEntry) {
      setMessage(`You have already submitted a word today: ${existingEntry.word} as ${existingEntry.name}`);
      return;
    }

    const newEntry = { name, ip, word, date: today };
    const updatedStory = [...story, newEntry];

    // Update GitHub repository using a serverless function
    const updateResponse = await axios.post('/api/update-story', { story: updatedStory });
    if (updateResponse.status === 200) {
      setStory(updatedStory);
      setContributors(updatedStory.map(entry => entry.name));
      setMessage('Your word has been added to the story!');
    } else {
      setMessage('Failed to update the story. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Open Source Novel</h1>
      <div className="story-container">
        <div className="story-box">
          <h2>The Story So Far</h2>
          <div className="story-content">
            {story.map((entry, index) => (
              <span key={index}>{entry.word} </span>
            ))}
          </div>
        </div>
        <div className="input-box">
          <h2>Add Your Word</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Your Word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
      <div className="contributors">
        <h2>Contributors</h2>
        <div className="contributors-list">
          {contributors.map((name, index) => (
            <span key={index}>{name} </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;