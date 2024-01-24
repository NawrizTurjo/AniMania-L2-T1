import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';

export default function Episodes() {
    const {id} = useParams();
    const [anime,setAnime] = useState([]);
    const [loading,setLoading] = useState(true);
    const getAnime = async () => {
        try {
          setLoading(true);
          console.log(1);
          const res = await axios.get(`http://localhost:3000/watch/anime/episodes/${id}`);
          setAnime(res.data);
          setLoading(false);
        //   console.log(res.data);
        } catch (err) {
          console.error(err.message);
        }
      };
      useEffect(() => {
        getAnime();
      }, []);
      useEffect(() => {
        console.log(anime);
      }, [anime]);
      if(loading){
        return <h1>Loading...</h1>
      }
  return (
    <h1>episodePage of {id}</h1>
  )
}
