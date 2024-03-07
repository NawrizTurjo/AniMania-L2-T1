import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Paper, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { uploadImage } from "./userDashboard";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { motion } from "framer-motion/dist/framer-motion";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";

export default function Admin() {

    const [moderators, setModerators] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading]= useState(false);
    let [stat, setStat] = useState(false);

    
    const getModerators = async () => {
        try {
            setLoading(true);
            const response = await axios.post("http://localhost:3000/getInterMod");
            setModerators(response.data);
            console.log(response.data);
            setLoading(false);
    } catch (error) {
      console.error("Error fetching moderators:", error.message);
    }
  };

  const getLogs = async () => {
    try {
        setLoading(true);
        const response = await axios.post("http://localhost:3000/admin/getLog");
        setLogs(response.data);
        console.log(response.data);
        setLoading(false);
} catch (error) {
  console.error("Error fetching moderators:", error.message);
}
};

  const handleApproveMod = async (e, updatedId) => {
    e.preventDefault();
    try {
      //console.log(char_id);
      const response = await axios.put(
        `http://localhost:3000/approvemod`,
        JSON.stringify({ updatedId}),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getModerators();
      getLogs();
      setStat((prev) => !prev);
      //setUpdatedId(0);
    } catch (error) {
      console.error("Error Updating review");
    }
  };

  const handleDeclineMod = async (e, updatedId) => {
    e.preventDefault();
    try {
      console.log(updatedId);
      const response = await axios.put(
        `http://localhost:3000/declinemod`,
        JSON.stringify({ updatedId }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getModerators();
      getLogs();
      setStat((prev) => !prev);
      //setUpdatedId(0);
      //getModeratorsCount();
    } catch (error) {
      console.error("Error Updating review");
    }
  };
  
    useEffect(() => {
      getModerators();
    }, [stat]);

    useEffect(() => {
        getLogs();
      }, [stat]);

    const [animeCount, setAnimeCount] = useState(0);

  useEffect(() => {
    // Function to fetch anime count
    const fetchAnimeCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getAnimesCount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ id: 'someId' }), // if you need to send a body
        });
        const count = await response.json();
        setAnimeCount(count);
      } catch (error) {
        console.error("Error fetching anime count:", error);
      }
    };

    fetchAnimeCount();
  }, []);

  const [episodesCount, setEpisodesCount] = useState(0);

  useEffect(() => {
    // Function to fetch episodes count
    const fetchEpisodesCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getEpisodesCount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ id: 'someId' }), // if you need to send a body
        });
        const count = await response.json();
        setEpisodesCount(count);
      } catch (error) {
        console.error("Error fetching episodes count:", error);
      }
    };

    fetchEpisodesCount();
  }, []); 

  const [charactersCount, setCharactersCount] = useState(0);

  useEffect(() => {
    // Function to fetch characters count
    const fetchCharactersCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getCharactersCount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ id: 'someId' }), // if needed
        });
        const count = await response.json();
        setCharactersCount(count);
      } catch (error) {
        console.error("Error fetching characters count:", error);
      }
    };

    fetchCharactersCount();
  }, []); 
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    // Function to fetch staff count from the backend
    const fetchStaffCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getStaffsCount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // If you need to send a body with the request
          // body: JSON.stringify({ someKey: 'someValue' }),
        });
        const count = await response.json();
        setStaffCount(count);
      } catch (error) {
        console.error("Error fetching staff count:", error);
      }
    };

    fetchStaffCount();
  }, []);

  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    const fetchReviewsCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getReviewsCount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // If your endpoint requires a request body
          // body: JSON.stringify({ key: 'value' }),
        });
        const count = await response.json();
        setReviewsCount(count);
      } catch (error) {
        console.error("Error fetching reviews count:", error);
      }
    };

    fetchReviewsCount();
  }, []); 

  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getCommentsCount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // If the endpoint requires a request body, include it here
          // body: JSON.stringify({ key: 'value' }),
        });
        const count = await response.json();
        setCommentsCount(count);
      } catch (error) {
        console.error("Error fetching comments count:", error);
      }
    };

    fetchCommentsCount();
  }, []); 

  const [genresCount, setGenresCount] = useState(0);

  useEffect(() => {
    const fetchGenresCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getGenresCount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // If the endpoint requires a request body, include it here
          // body: JSON.stringify({ key: 'value' }),
        });
        const count = await response.json();
        setGenresCount(count);
      } catch (error) {
        console.error("Error fetching genres count:", error);
      }
    };

    fetchGenresCount();
  }, []);

  const [tagsCount, setTagsCount] = useState(0);

  useEffect(() => {
    const fetchTagsCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getTagsCount', { // Ensure the port matches your frontend's
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // If your endpoint expects a body, include it here. If not, this line can be removed.
          // body: JSON.stringify({}),
        });
        if (response.ok) {
          const count = await response.json();
          setTagsCount(count);
        } else {
          console.error('Failed to fetch tags count');
        }
      } catch (error) {
        console.error("Error fetching tags count:", error);
      }
    };

    fetchTagsCount();
  }, []);

  const [studiosCount, setStudiosCount] = useState(0);

  useEffect(() => {
    const fetchStudiosCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getStudiosCount', { // Ensure the port matches your frontend's
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // If your endpoint expects a body, include it here. If not, this line can be removed.
          // body: JSON.stringify({}),
        });
        if (response.ok) {
          const count = await response.json();
          setStudiosCount(count);
        } else {
          console.error('Failed to fetch studios count');
        }
      } catch (error) {
        console.error("Error fetching studios count:", error);
      }
    };

    fetchStudiosCount();
  }, []);

  const [soundtracksCount, setSoundtracksCount] = useState(0);

  useEffect(() => {
    const fetchSoundtracksCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getSoundTracksCount', { // Ensure the port matches your frontend's
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // If your endpoint expects a body, include it here. If not, this line can be removed.
          // body: JSON.stringify({}),
        });
        if (response.ok) {
          const count = await response.json();
          setSoundtracksCount(count);
        } else {
          console.error('Failed to fetch soundtracks count');
        }
      } catch (error) {
        console.error("Error fetching soundtracks count:", error);
      }
    };

    fetchSoundtracksCount();
  }, []);

  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getUsersCount', { // Ensure the port matches your frontend's
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // If your endpoint expects a body, include it here. If not, this line can be removed.
          // body: JSON.stringify({}),
        });
        if (response.ok) {
          const count = await response.json();
          setUsersCount(count);
        } else {
          console.error('Failed to fetch users count');
        }
      } catch (error) {
        console.error("Error fetching users count:", error);
      }
    };

    fetchUsersCount();
  }, []);

//   const [moderatorsCount, setModeratorsCount] = useState(0);

//   useEffect(() => {
//     const fetchModeratorsCount = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/admin/getModeratorsCount', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (response.ok) {
//           const { count } = await response.json();
//           setModeratorsCount(count);
//           console.log(count);
//         } else {
//           console.error('Failed to fetch moderators count');
//         }
//       } catch (error) {
//         console.error('Error fetching moderators count:', error);
//       }
//     };
  
//     fetchModeratorsCount();
//   }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* First vertical bar */}
      <Box sx={{ flex: "1 1 50%", borderRight: "1px solid #ccc", padding: "20px" }}>
        <Paper elevation={3} sx={{ padding: "20px", maxHeight: "70vh", overflowY: "auto" }}>
          {/* First area content */}
          <h2>List of Moderators</h2>
          {/* Render list of moderators */}
          {moderators.map((comment, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <Typography variant="body1">
                ID: {comment.id}
              </Typography>
              <Typography variant="body1">
                Name: {comment.user_name}
              </Typography>
              <Typography variant="body1">
                Email: {comment.email}
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => handleApproveMod(e, comment.id)}
                style={{ marginRight: "10px" }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => handleDeclineMod(e, comment.id)}
              >
                Decline
              </Button>
            </div>
          ))}
        </Paper>
      </Box>
  
      {/* Second vertical bar */}
      <Box sx={{ flex: "1 1 50%", borderRight: "1px solid #ccc", padding: "20px" }}>
  {/* Second area content here */}
  <div style={{ maxHeight: "calc(100vh - 40px)", overflowY: "auto" }}>
  <h2>Total Counts</h2>
  <ul style={{ listStyle: "none", padding: 0 }}>
    <li style={{ marginBottom: "20px" }}>
      <h3>Animes: {animeCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Episodes: {episodesCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Characters: {charactersCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Staffs: {staffCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Reviews: {reviewsCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Comments: {commentsCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Genres: {genresCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Tags: {tagsCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Studios: {studiosCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Soundtracks: {soundtracksCount}</h3>
    </li>
    <li style={{ marginBottom: "20px" }}>
      <h3>Users: {usersCount}</h3>
    </li>
  </ul>
</div>

</Box>

      
      {/* Third vertical bar */}
      <Box sx={{ flex: "1 1 50%", padding: "20px" }}>
        {/* Third area content here, similar structure with maxHeight and overflowY for scrolling */}
        <Paper elevation={3} sx={{ padding: "20px", maxHeight: "70vh", overflowY: "auto" }}>
          {/* First area content */}
          <h2>List of Functions/Procedure Called</h2>
          {/* Render list of moderators */}
          {logs.map((comment, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <Typography variant="body1">
                Log ID: {comment.log_id}
              </Typography>
              <Typography variant="body1">
                Function/ Procedure Name: {comment.function_or_procedure_name}
              </Typography>
              <Typography variant="body1">
                Person ID: {comment.person_id}
              </Typography>
              <Typography variant="body1">
                Anime ID: {comment.anime_id}
              </Typography>
              <Typography variant="body1">
                Episode No. : {comment.episode_no}
              </Typography>
              <Typography variant="body1">
                Comment ID: {comment.comment_id}
              </Typography>
              <Typography variant="body1">
                Track Date: {comment.track_date}
              </Typography>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={(e) => handleApproveMod(e, comment.id)}
                style={{ marginRight: "10px" }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => handleDeclineMod(e, comment.id)}
              >
                Decline
              </Button> */}
            </div>
          ))}
        </Paper>
      </Box>
    </Box>
  );
  
}
