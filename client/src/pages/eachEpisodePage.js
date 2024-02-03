

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {  Link } from 'react-router-dom';
import { motion } from "framer-motion/dist/framer-motion";
import { useLocation, useParams } from "react-router";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


export default function Episode({ toggleRerender,setProgress }) {
    const { id, id2 } = useParams();
    const [anime, setAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentloading, setCommentLoading] = useState(true);
    const [comment, setComment] = useState("");
    const location = useLocation();
    const [stat, setStat] = useState(false);
    const [statr, setStatr] = useState(false);
    const [animeStat, setAnimeStat] = useState(false);
    const [editedText,setEditedText] = useState("");
    const [comments, setComments] = useState([]);
    const [reply, setReply]=useState("");
    const [replies, setReplies]=useState([]);
    //const [repliesVisible, setRepliesVisible] = useState(false);


    const {
        user: routeUser,
        email: routeEmail,
        userRole: routeUserRole,
        img_url: routeImgUrl,
      } = location.state || {};
    
      // Use local state to store user information
      const [user, setUser] = useState(
        routeUser || localStorage.getItem("user") || ""
      );
      const [email, setEmail] = useState(
        routeEmail || localStorage.getItem("email") || ""
      );
    
      const [userRole, setUserRole] = useState(
        routeUserRole || localStorage.getItem("userRole") || ""
      );
    
      const [img_url, setImgUrl] = useState(
        routeImgUrl || localStorage.getItem("img_url") || ""
      );
    
      //   console.log(user, email, img_url, userRole);
      //let [cleanedText, setCleanedText] = useState("");

    const getAnime = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}`);
            setAnime(res.data[0]);
            setLoading(false);
            setAnimeStat((prev) => !prev);
            setProgress(50);
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleSubmitComments = async (event) => {
        event.preventDefault();
        //console.log("Review:", review, "by ", user);
        try {
          await axios.post(`http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}`, {
            id: id,
            id2:id2,
            comment: comment,
            // user: user,
            email: email,
          });
          // setReviews(res.data[0]);
          // console.log(res.data[0]);
          // setReviews([...reviews, response.data]);
          // console.log(response.data[0]);
          setComment("");
          setStat((prev) => !prev);
        } catch (err) {
          console.log(err.message);
        }
        // toggleRerender();
      };

      const handleSubmitReplies = async (parentId) => {
        //event.preventDefault();
        //console.log("Review:", review, "by ", user);
        try {
          await axios.post(`http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}`, {
            id: id,
            id2:id2,
            reply: reply,
            // user: user,
            email: email,
            parentId:parentId
          });
          // setReviews(res.data[0]);
          // console.log(res.data[0]);
          // setReviews([...reviews, response.data]);
          // console.log(response.data[0]);
          console.log(reply);
          console.log(parentId);
          setReply("");
          setStatr((prev) => !prev);
        } catch (err) {
          console.log(err.message);
        }
        // toggleRerender();
      };
    
      const getReview = async (event) => {
        try {
            setCommentLoading(true);
            const res = await axios.get(
                `http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}/comments`
            );
    
            if (res.status === 200) {
                const commentsWithReplies = await Promise.all(res.data.map(async (comment) => {
                    const response = await axios.get(
                        `http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}/comments/${comment.comment_id}`
                    );
                    comment.replies = response.data;
                    return comment;
                }));
    
                setComments(commentsWithReplies);
            } else if (res.status === 404) {
                // Handle case when no comments are found
                setComments([]); // Set empty array for comments
            }
    
            setCommentLoading(false);
            setTimeout(() => {
                setProgress(100);
            }, 500);
    
        } catch (err) {
            console.error(err.message);
        }
    };
    
    
      useEffect(() => {
        getReview();
      }, [stat,animeStat]);
      useEffect(() => {
        console.log(comments); // Log updated reviews state
      }, [comments]);
       // Log reviews whenever it changes

    //    const getReply = async (event,parentId) => {
    //     try {
    //       setCommentLoading(true);
    //       const res = await axios.get(
    //         `http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}/comments/${parentId}`
    //       );
    //       //   setAnime(res.data[0]);
    //       //console.log(res.data.age_rating);
    //       // setStat((prev)=>(!prev));
    //       console.log(statr);
    //       setReplies(res.data);
    //       console.log(replies);
    //       console.log(res.data);
    //       setCommentLoading(false);
    //       setTimeout(() => {
    //         setProgress(100);
    //       }, 500);
            
    //     } catch (err) {
    //       console.error(err.message);
    //     }
    //   };
      useEffect(() => {
        getReview();
      }, [stat,animeStat]);



      useEffect(() => {
        console.log(comments); // Log updated reviews state
      }, [comments]);
    
      useEffect(() => {
        getAnime();
        // toggleRerender();
      }, []); // Log reviews whenever it changes
      // if (loading || reviewloading) {
      //   return <h1>Loading...</h1>;
      // }
    
      const handleUpdateReview = async (commentId,commentText) => {
        
        //console.log("Review:", review, "by ", user);
        try {
          await axios.put(`http://localhost:3000/updateComment`, {
            comment_id: commentId,
            comment_text: commentText
          });
          setEditedText("");
    
          // setReviews(res.data[0]);
          // console.log(res.data[0]);
          // setReviews([...reviews, response.data]);
          // console.log(response.data[0]);
          // setReview("");
          setStat((prev) => !prev);
        } catch (err) {
          console.log(err.message);
        }
        // toggleRerender();
      };

    useEffect(() => {
        getAnime();
    }, [id, id2]);

    // const handleSubmitComments = (event) => {
    //     event.preventDefault();
    //     console.log("Comments:", comments);
    //     // Add your logic to submit the comments here
    //     // For example, you can make an API call to send the comments data to your backend
    // };

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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
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
                                    <strong>
                                        <label htmlFor="comment">Your Comment:</label>
                                    </strong>
                                    <textarea
                                        className="form-control"
                                        id="comment"
                                        rows="3"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        style={{ resize: "none" }}
                                    ></textarea>
                                </div>
    
                                {comment !== "" ? (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Submit Comment
                                    </Button>
                                ) : (
                                    <Button
                                        disabled
                                        variant="contained"
                                        color="primary"
                                    >
                                        Submit Comment
                                    </Button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    
            <div>
                {!commentloading ? (
                    <div>
                        {comments.map((comment, index) => (
                            <div key={index}>
                                {/* Render reviewer information */}
                                <Box
                                    sx={{
                                        mt: 4,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar alt={comment.reviewer} src={comment.img_src} />
                                        <Typography variant="body1">{comment.reviewer}</Typography>
                                    </Stack>
                                </Box>
    
                                {/* Render editable textarea for user's own comment */}
                                {email === comment.email ? (
                                    <Box sx={{ mt: 2, textAlign: "center" }}>
                                        <textarea
                                            className="form-control"
                                            id={`review-${index}`}
                                            rows={Math.min(
                                                Math.ceil(comment.text.length / 200) + 2,
                                                25 // Maximum of 20 rows
                                            )}
                                            value={comment.text}
                                            style={{ resize: "none", width: "100%" }}
                                            onChange={(e) => {
                                                setEditedText(e.target.value);
                                                comment.text = e.target.value;
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdateReview(comment.comment_id, editedText)}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                ) : (
                                    // Render read-only textarea for other reviews
                                    <Box sx={{ mt: 2, textAlign: "center" }}>
                                        <textarea
                                            className="form-control-disabled"
                                            id={`review-${index}`}
                                            rows={Math.min(
                                                Math.ceil(comment.text.length / 200) + 2,
                                                25 // Maximum of 20 rows
                                            )}
                                            value={comment.text}
                                            style={{ resize: "none", width: "100%" }}
                                            readOnly
                                        />
                                    </Box>
                                )}
    
                                {/* Render replies */}
                                <div>
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div>
                                            {comment.replies.map((reply, replyIndex) => (
                                                <div key={`reply-${replyIndex}`}>
                                                    <Box
                                                        sx={{
                                                            mt: 2,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Avatar alt={reply.reviewer} src={reply.img_src} />
                                                            <Typography variant="body1">{reply.reviewer}</Typography>
                                                        </Stack>
                                                    </Box>
                                                    <Box sx={{ mt: 2, textAlign: "center" }}>
                                                        <textarea
                                                            className="form-control-disabled"
                                                            id={`reply-${index}-${replyIndex}`}
                                                            rows={Math.min(
                                                                Math.ceil(reply.text.length / 200) + 2,
                                                                25 // Maximum of 20 rows
                                                            )}
                                                            value={reply.text}
                                                            style={{ resize: "none", width: "100%" }}
                                                            readOnly
                                                        />
                                                    </Box>
                                                </div>
                                            ))}
                                        </div>
                                    )}
    
                                    {/* Reply form */}
                                    <form onSubmit={() => handleSubmitReplies( comment.comment_id)}>
                                        <div className="form-group">
                                            <strong>
                                                <label htmlFor={`reply-${index}`}>Your Reply:</label>
                                            </strong>
                                            <textarea
                                                className="form-control"
                                                id={`reply-${index}`}
                                                rows="2"
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                                style={{ resize: 'none' }}
                                            ></textarea>
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                        >
                                            Submit Reply
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Render a loading indicator or placeholder if reviews are still loading
                    <h3>Loading reviews...</h3>
                )}
            </div>
        </motion.div>
    )
                }    


