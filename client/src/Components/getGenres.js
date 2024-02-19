import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function getGenres() {
    const [genre, setGenre] = useState([]);
    useEffect(() => {
        setProgress(10);
        
      axios.get(`http://localhost:3000/genre`)
        .then(res => {
          // console.log(res.data);
          setGenre(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
        setTimeout(() => {
          setProgress(100);
        }, 1000);
    }, []);
  return (
    genre
  )
}

export function getTags() {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        setProgress(10);
        
      axios.get(`http://localhost:3000/tags`)
        .then(res => {
          // console.log(res.data);
          setTags(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
        setTimeout(() => {
          setProgress(100);
        }, 1000);
    }, []);
  return (
    tags
  )
}
