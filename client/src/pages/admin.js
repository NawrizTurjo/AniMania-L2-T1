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
      setStat((prev) => !prev);
      //setUpdatedId(0);
    } catch (error) {
      console.error("Error Updating review");
    }
  };
  
    useEffect(() => {
      getModerators();
    }, [stat]);

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
        {/* Second area content here, similar structure with maxHeight and overflowY for scrolling */}
      </Box>
  
      {/* Third vertical bar */}
      <Box sx={{ flex: "1 1 50%", padding: "20px" }}>
        {/* Third area content here, similar structure with maxHeight and overflowY for scrolling */}
      </Box>
    </Box>
  );
  
}
