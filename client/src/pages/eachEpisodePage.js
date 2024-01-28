// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';

// export default function Episode() {
//     const { id, id2 } = useParams();
//     const [anime, setAnime] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [comments, setComments] = useState("");
//     var ecount=0;

//     const getAnime = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(`http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}`);
//             setAnime(res.data[0]);
//             console.log(ecount);
//             //ecount=parseInt(anime.number_of_episodes);
//             console.log(ecount);
//             //console.log(anime.episode_no);
//             setLoading(false);
//         } catch (err) {
//             console.error(err.message);
//         }
//     };

//     useEffect(() => {
//         getAnime();
//     }, []);

//     const handleSubmitComments = (event) => {
//         event.preventDefault();
//         console.log("Comments:", comments);
//         // Add your logic to submit the comments here
//         // For example, you can make an API call to send the comments data to your backend
//     };

//     if (loading) {
//         return <h1>Loading...</h1>
//     }

//     return (
//         <div>
//             <div className="row justify-content-center">
//                 <div className="col-lg-8">
//                     {/* Larger title screen */}
//                     <div className="d-flex justify-content-center mb-4">
//                         <img
//                             src={anime.thumbnail}
//                             alt={anime.episode_title}
//                             style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
//                         />
//                     </div>
//                     {/* Anime details */}
//                     <div className="card shadow-lg">
//                         <div className="card-body">
//                             <h2 className="card-title text-center">{anime.episode_title}</h2>
//                             <ul className="list-group list-group-flush">
//                                 <li className="list-group-item"><strong>Episode Number:</strong> {anime.episode_no}</li>
//                                 <li className="list-group-item"><strong>Release Date:</strong> {anime.release_date}</li>
//                                 <li className="list-group-item"><strong>Availability:</strong> {anime.availability}</li>
//                                 <li className="list-group-item"><strong>Anime ID:</strong> {anime.anime_id}</li>
//                                 <li className="list-group-item"><strong>Streaming Sites:</strong> {anime.streaming_sites}</li>
//                                 <li className="list-group-item"><strong>Length:</strong> {anime.LENGTH}</li>
//                             </ul>
//                             <div className="d-flex justify-content-between mt-3">
//     {parseInt(id2) === 1 ? (
//         <button className="btn btn-primary" disabled>Previous Episode</button>
//     ) : (
//         <Link to={`/watch/anime/episodes/${id}/episode/${parseInt(id2) - 1}`}>
//             <button className="btn btn-primary">Previous Episode</button>
//         </Link>
//     )}
//     {parseInt(id2) === anime.number_of_episodes ? (
//         <button className="btn btn-primary" disabled>Next Episode</button>
//     ) : (
//         <Link to={`/watch/anime/episodes/${id}/episode/${parseInt(id2) + 1}`}>
//             <button className="btn btn-primary">Next Episode</button>
//         </Link>
//     )}
// </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* Comments box */}
//             <div className="row justify-content-center mt-5">
//                 <div className="col-lg-8">
//                     <div className="card border-primary">
//                         <div className="card-body">
//                             <form onSubmit={handleSubmitComments}>
//                                 <div className="form-group">
//                                     <strong><label htmlFor="comments">Your Comments:</label></strong>
//                                     <textarea
//                                         className="form-control"
//                                         id="comments"
//                                         rows="3"
//                                         value={comments}
//                                         onChange={(e) => setComments(e.target.value)}
//                                         style={{ resize: 'none' }}
//                                     ></textarea>
//                                 </div>
//                                 <button type="submit" className="btn btn-primary">Submit Comments</button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Episode() {
    const { id, id2 } = useParams();
    const [anime, setAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState("");

    const getAnime = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}`);
            setAnime(res.data[0]);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getAnime();
    }, [id, id2]);

    const handleSubmitComments = (event) => {
        event.preventDefault();
        console.log("Comments:", comments);
        // Add your logic to submit the comments here
        // For example, you can make an API call to send the comments data to your backend
    };

    if (loading) {
        return <h1>Loading...</h1>
    }

    const renderPagination = () => {
        const paginationButtons = [];
        for (let i = 1; i <= anime.number_of_episodes; i++) {
            paginationButtons.push(
                <Link key={i} to={`/watch/anime/episodes/${id}/episode/${i}`} className="col-auto">
                    <button className="btn btn-primary mb-2">{i}</button>
                </Link>
            );
        }
        return paginationButtons;
    };

    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-center mb-4">
                        <img
                            src={anime.thumbnail}
                            alt={anime.episode_title}
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-center">{anime.episode_title}</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Episode Number:</strong> {anime.episode_no}</li>
                                <li className="list-group-item"><strong>Release Date:</strong> {anime.release_date}</li>
                                <li className="list-group-item"><strong>Availability:</strong> {anime.availability}</li>
                                <li className="list-group-item"><strong>Anime ID:</strong> {anime.anime_id}</li>
                                <li className="list-group-item"><a href={anime.streaming_sites}><strong>Streaming Sites</strong></a></li>
                                <li className="list-group-item"><strong>Length:</strong> {anime.LENGTH}</li>
                            </ul>
                            <div className="d-flex flex-wrap justify-content-center mt-3">
                                {renderPagination()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-5">
                <div className="col-lg-8">
                    <div className="card border-primary">
                        <div className="card-body">
                            <form onSubmit={handleSubmitComments}>
                                <div className="form-group">
                                    <strong><label htmlFor="comments">Your Comments:</label></strong>
                                    <textarea
                                        className="form-control"
                                        id="comments"
                                        rows="3"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        style={{ resize: 'none' }}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit Comments</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



