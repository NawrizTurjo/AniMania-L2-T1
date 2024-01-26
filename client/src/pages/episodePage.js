import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';

export default function Episodes() {
    const {id} = useParams();
    const [anime,setAnime] = useState([]);
    const [loading,setLoading] = useState(true);
    //let [source,setsource]=useState("");
    const [review, setReview] = useState("");

    
    const getAnime = async () => {
        try {
          setLoading(true);
          console.log(1);
          const res = await axios.get(`http://localhost:3000/watch/anime/episodes/${id}`);
          setAnime(res.data[0]);
          //console.log(res.data.age_rating);
          setLoading(false);
        //   console.log(res.data);
        } catch (err) {
          console.error(err.message);
        }
      };
      useEffect(() => {
        getAnime();
      }, []);
      const handleSubmitReview = (event) => {
        event.preventDefault();
        console.log("Review:", review);
        // Add your logic to submit the review here
        // For example, you can make an API call to send the review data to your backend
    };
      useEffect(() => {
        console.log(anime);
        // console.log(anime.age_rating);
        // console.log(anime.age_rating);
        // console.log(anime.age_rating);
        // setsource(anime.SOURCE);
        //console.log(anime.id);
      }, [anime]);
      if(loading){
        return <h1>Loading...</h1>
      }
      return (
        <div>
            <div className="row justify-content-center">
                <div className="col-lg-4">
                    {/* Larger title screen */}
                    <img
                        src={anime.title_screen}
                        alt={anime.anime_name}
                        style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                    />
                    {/* Add a button below the title screen */}
                    <a href={`http://localhost:3001/watch/anime/episodes/${id}/episode/1`}>
                        <button className="btn btn-danger btn-lg btn-block mt-3">Watch Now</button>
                    </a>
                </div>
                <div className="col-lg-8">
                    {/* Anime details */}
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-center">{anime.anime_name}</h2>
                            <p className="card-text">{anime.description}</p>
                            <div className="row">
                                <div className="col-md-6">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item"><strong>Genre:</strong> {anime.genres}</li>
                                        <li className="list-group-item"><strong>Year:</strong> {anime.year}</li>
                                        <li className="list-group-item"><strong>Source:</strong> {anime.SOURCE}</li>
                                        <li className="list-group-item"><strong>Type:</strong> {anime.TYPE}</li>
                                        <li className="list-group-item"><strong>Tags:</strong> {anime.tags}</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item"><strong>Age Rating:</strong> {anime.age_rating}</li>
                                        <li className="list-group-item"><strong>Anime ID:</strong> {anime.anime_id}</li>
                                        <li className="list-group-item"><strong>Demographic:</strong> {anime.demographic}</li>
                                        <li className="list-group-item"><strong>MAL Score:</strong> {anime.mal_score}</li>
                                        <li className="list-group-item"><strong>Number of Episodes:</strong> {anime.number_of_episodes}</li>
                                        <li className="list-group-item"><strong>Season:</strong> {anime.season}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Review box */}
            <div className="row justify-content-center mt-5">
                <div className="col-lg-8">
                    <div className="card border-primary">
                        <div className="card-body">
                            <form onSubmit={handleSubmitReview}>
                                <div className="form-group">
                                    <strong><label htmlFor="review">Your Review:</label></strong>
                                    <textarea
                                        className="form-control"
                                        id="review"
                                        rows="3"
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        style={{ resize: 'none' }}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit Review</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// const styles = {
//   container: {
//       maxWidth: '800px',
//       margin: '0 auto',
//       padding: '20px',
//       fontFamily: 'Arial, sans-serif',
//   },
//   header: {
//       textAlign: 'center',
//       marginBottom: '30px',
//   },
//   title: {
//       fontSize: '36px',
//       marginBottom: '10px',
//   },
//   image: {
//       width: '50%',
//       borderRadius: '8px',
//       boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//   },
//   detailsContainer: {
//       background: '#f9f9f9',
//       padding: '20px',
//       borderRadius: '8px',
//       boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//   },
//   description: {
//       marginBottom: '20px',
//   },
//   details: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//       gap: '10px',
//   },
//   detailLabel: {
//       fontWeight: 'bold',
//   },
// };
