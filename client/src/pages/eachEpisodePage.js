

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
    const [statl, setStatl] = useState(false);
    const [statd, setStatd] = useState(false);
    const [animeStat, setAnimeStat] = useState(false);
    const [animeStatl, setAnimeStalt] = useState(false);
    const [animeStatr, setAnimeStatr] = useState(false);
    const [animeStatd, setAnimeStatd] = useState(false);
    const [editedText,setEditedText] = useState("");
    const [comments, setComments] = useState([]);
    const [reply, setReply]=useState("");
    const [replies, setReplies]=useState([]);
    const [replyIndex, setReplyIndex] = useState(null);
    const [likes, setLikes]=useState([]);
    const [dislikes, setDislikes]=useState([]);
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

      //# problem
      const handleSubmitReplies = async (e,parentId) => {
        e.preventDefault();
        //console.log("Review:", review, "by ", user);
        try {
          await axios.post(`http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}/reply`, {
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
      const handleSubmitLikes = async (e,commentId) => {
        e.preventDefault();
        try {
          await axios.post(`http://localhost:3000/reactionL`, {
            email: email,
            commentId:commentId
          });
          setStatl((prev) => !prev);
        } catch (err) {
          console.log(err.message);
        }
        // toggleRerender();
      };
      const handleSubmitDisLikes = async (e,commentId) => {
        e.preventDefault();
        try {
          await axios.post(`http://localhost:3000/reactionD`, {
            email: email,
            commentId:commentId
          });
          setStatd((prev) => !prev);
        } catch (err) {
          console.log(err.message);
        }
        // toggleRerender();
      };

      //# problem
    
      const getReview = async (event) => {
        try {
            setCommentLoading(true);
            const res = await axios.get(
                `http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}/comments`
            );
                    //------------------------------------------------------------------------------get parent comments
    
            // if (res.status === 200) {
            //     const commentsWithReplies = await Promise.all(res.data.map(async (comment) => {
            //         console.log(comment.comment_id)
            //         let cId = comment.comment_id?comment.comment_id:0;
            //         const response = await axios.get(
            //             `http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}/comments/${cId}`
            //         );
            //         comment.replies = response.data;
            //         return comment;
            //     }));
    
            setComments(res.data);
            // } else if (res.status === 404) {
            //     // Handle case when no comments are found
            //     setComments([]); // Set empty array for comments
            // }
    
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

       const getReply = async (event) => {
        try {
          setCommentLoading(true);
          const res = await axios.get(
            `http://localhost:3000/watch/anime/episodes/${id}/episode/${id2}/replies`
          );
          //   setAnime(res.data[0]);
          //console.log(res.data.age_rating);
          // setStat((prev)=>(!prev));
          console.log(statr);
          setReplies(res.data);
          console.log(replies);
          console.log(res.data);
          setCommentLoading(false);
          setTimeout(() => {
            setProgress(100);
          }, 500);
            
        } catch (err) {
          console.error(err.message);
        }
      };
      const getLike = async (event) => {
        try {
          setCommentLoading(true);
          const res = await axios.get(
            `http://localhost:3000/getlikes`
          );
          //   setAnime(res.data[0]);
          //console.log(res.data.age_rating);
          // setStat((prev)=>(!prev));
          //console.log(statr);
          //--------------------------setLikes(res.data);
          setLikes(res.data.reduce((acc, curr) => {
            acc[curr.comment_id] = curr.total_likes;
            return acc;
        }, {}));
          //console.log(replies);
          console.log(res.data);
          setCommentLoading(false);
          setTimeout(() => {
            setProgress(100);
          }, 500);
            
        } catch (err) {
          console.error(err.message);
        }
      };
      const getDisLike = async (event) => {
        try {
          setCommentLoading(true);
          const res = await axios.get(
            `http://localhost:3000/getdislikes`
          );
          //   setAnime(res.data[0]);
          //console.log(res.data.age_rating);
          // setStat((prev)=>(!prev));
          //console.log(statr);
          //----------------------setDislikes(res.data);
          setDislikes(res.data.reduce((acc, curr) => {
            acc[curr.comment_id] = curr.total_dislikes;
            return acc;
        }, {}));
          //console.log(replies);
          console.log(res.data);
          setCommentLoading(false);
          setTimeout(() => {
            setProgress(100);
          }, 500);
            
        } catch (err) {
          console.error(err.message);
        }
      };
      useEffect(() => {
        getReply();
      }, [statr,animeStatr]);
      useEffect(() => {
        getLike();
      }, [statl,animeStatl,statd,animeStatd]);
      useEffect(() => {
        getDisLike();
      }, [statl,animeStatl,statd,animeStatd]);



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
                            <div key={index}  style={{ marginBottom: '20px' }}>
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
                                {/* <div style={{ marginBottom: '10px' }}>
    <Typography variant="body1">Likes: {likes[comment.comment_id]}</Typography>
    <Typography variant="body1">Dislikes: {dislikes[comment.comment_id]}</Typography>
</div> */}

    
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
                                            style={{ resize: "none", width: "100%",marginBottom: "10px" }}
                                            onChange={(e) => {
                                                setEditedText(e.target.value);
                                                comment.text = e.target.value;
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdateReview(comment.comment_id, editedText)}
                                            style={{ marginBottom: "10px" }}
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
                                 {/* <div style={{ marginBottom: '10px' }}>
                                    <Button
                                        onClick={(e) => handleSubmitLikes(e, comment.comment_id)}
                                        variant="contained"
                                        color="primary"
                                        style={{ marginRight: '50px' }}
                                    >
                                        Like
                                    </Button>
                                    <Button
                                        onClick={(e) => handleSubmitDisLikes(e, comment.comment_id)}
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Dislike
                                    </Button>
                                </div> */}

                                {replyIndex === index ? (
                                    <div>
                                        <form onSubmit={(e) => handleSubmitReplies(e, comment.comment_id)}>
                                            <div className="form-group" style={{ marginBottom: '10px' }}>
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
                                            {reply !== "" ? (
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Reply
                                                </Button>
                                            ) : (
                                                <Button
                                                    disabled
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Reply
                                                </Button>
                                            )}
                                        </form>
                                    </div>
                                ) : (
                                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>
                                    <Button
                                        onClick={(e) => handleSubmitLikes(e, comment.comment_id)}
                                        variant="contained"
                                        color="primary"
                                        style={{ marginRight: '5px' }}
                                    >
                                        Like
                                    </Button>
                                    <Typography variant="body1" style={{ marginRight: '10px' }}>
                                        {likes[comment.comment_id] || 0}
                                    </Typography>
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>
                                    <Button
                                        onClick={(e) => handleSubmitDisLikes(e, comment.comment_id)}
                                        variant="contained"
                                        color="secondary"
                                        style={{ marginRight: '5px' }}
                                    >
                                        Dislike
                                    </Button>
                                    <Typography variant="body1">
                                        {dislikes[comment.comment_id] || 0}
                                    </Typography>
                                    </div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setReplyIndex(index)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Reply
                                    </Button>
                                    </div>

                                    
                                )}
    
                                {/* Render replies */}
                                <div style={{ marginLeft: '100px', marginBottom: '10px' }}>
                                    {replies
                                        .filter((reply) => reply.parent_id === comment.comment_id)
                                        .map((reply, replyIndex) => (
                                            <div key={`reply-${replyIndex}`}>
                                                {/* Render reply */}
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
                                                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>
                                                <Button
                                                    onClick={(e) => handleSubmitLikes(e, reply.comment_id)}
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginRight: '5px' }}
                                                >
                                                    Like
                                                </Button>
                                                <Typography variant="body1" style={{ marginRight: '10px' }}>
                                                    {likes[reply.comment_id] || 0}
                                                </Typography>
                                                </div>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>
                                                <Button
                                                    onClick={(e) => handleSubmitDisLikes(e, reply.comment_id)}
                                                    variant="contained"
                                                    color="secondary"
                                                    style={{ marginRight: '5px' }}
                                                >
                                                    Dislike
                                                </Button>
                                                <Typography variant="body1">
                                                    {dislikes[reply.comment_id] || 0}
                                                </Typography>
                                                </div>
                                                </div>

                                            </div>
                                        ))}
    
                                    {/* Reply form */}
                                    
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


