import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GenreAnimes from './genre_id';

const Genre = () => {
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/genre`)
      .then(res => {
        console.log(res.data);
        setGenre(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>Genre</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Genre ID</th>
            <th>Genre Name</th>
          </tr>
        </thead>
        <tbody>
          {genre.map((genre) => (
            <React.Fragment key={genre.genre_id}>
              <tr>
                <td>{genre.genre_id}</td>
                <td>
                  <a href={`http://localhost:3000/genres/${genre.genre_id}`}>{genre.genre_name}</a>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  {/* <GenreAnimes id={genre.genre_id} /> */}
                  <h3>Need to print names of anime along with other info but server is crushing each time</h3>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Genre;
