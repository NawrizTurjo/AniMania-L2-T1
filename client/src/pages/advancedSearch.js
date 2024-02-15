import React, { useState } from 'react';
import axios from 'axios';

function AdvancedSearch() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const params = {
      title,
      genre,
      year,
    };

    try {
      const response = await axios.get('http://localhost:3000/search', { params });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Genre:
        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
      </label>
      <label>
        Year:
        <input type="text" value={year} onChange={(e) => setYear(e.target.value)} />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}

export default AdvancedSearch;