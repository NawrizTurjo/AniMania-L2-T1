import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { storage } from "./FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useLocation } from "react-router";
import axios from "axios";
import { Box, Button, Paper, TextField } from "@mui/material";
//import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
//import CloudUploadIcon from "@mui/icons-material/CloudUpload";
//import Button from "@mui/material/Button";
//import Paper from "@mui/material/Paper";
//import { motion } from "framer-motion/dist/framer-motion";
// import AnimeList from "../Components/getAnimeList";
// import History from "../Components/getHistory";

function Notifications()
{
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    let location = useLocation();
    let state = location.state;
  
    let [user, setUser] = useState("");
    let [person, setPerson] = useState({});
    let [loading, setLoading] = useState(true);
    let [name, setName] = useState("");
    let [bio, setBio] = useState("");
    let [most_favourite_anime, setMostFavouriteAnime] = useState("");
    let [first_access, setFirstAccess] = useState("");
    let [last_access, setLastAccess] = useState("");
    let [active_time, setActiveTime] = useState([]);
  
    user = state && state.user;
    let email = localStorage.getItem("email");

    let [img_url, setImgUrl] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [stat, setStat] = useState(false);
    const [contribution, setContribution] = useState(0);

    let getPerson = async () => {
        // e.preventDefault();
        try {
          let response = await axios.post(
            `http://localhost:3000/userDash`,
            JSON.stringify({ email }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          let personData = response.data[0];
          const activeTime = personData?.active_time || {}; // Initialize activeTime as an object
          console.log(activeTime);
          // const formattedInterval = formatActiveTime(activeTime); // Format the active time
          const formattedActiveTime = `${activeTime.days} day(s) ${activeTime.hours}h ${activeTime.minutes}m ${activeTime.seconds}s ${activeTime.milliseconds}ms`;
          console.log(formattedActiveTime);
    
          person = {
            // user: personData?.user_name || "",
            name: personData?.name || "",
            img_url: personData?.img_url || "",
            bio: personData?.bio || "",
            most_favourite_anime: personData?.most_favourite_anime || "",
            first_access: personData?.first_access || 0,
            last_access: personData?.last_access || 0,
            active_time: formattedActiveTime,
          };
          console.log(person);
          console.log(person.img_url);
          setPerson(person);
          setActiveTime(formattedActiveTime);
          setBio(person.bio);
          setFirstAccess(person.first_access);
          setLastAccess(person.last_access);
          setMostFavouriteAnime(person.most_favourite_anime);
          setName(person.name);
          setUrl(personData?.img_url || "");
          console.log(url);
          setStat((prev) => !prev);
        } catch (err) {
          console.log(err);
        }
      };

      const getNotifications = async () => {
        try {
          console.log(email);
          const res = await axios.post(
            "http://localhost:3000/getNotifications",
            { email }
          );
          // console.log(res.data);
          setTimeout(() => {
            setNotifications(res.data);
          }, 10000);
          console.log(Notifications);
          // setLoading(false);
          setLoading(false);
        } catch (err) {
          console.error(err.message);
        }
      };

      useEffect(() => {
        getPerson();
        // getAnimeList();
        //getContribution();
      }, []);
    
      useEffect(() => {
        getNotifications();
      }, [notifications]);

      if (loading) {
        return <h2>Loading...</h2>;
      }

      return (
        <div>
          <h2>Notifications For You</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>Notifications For You</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((notification, index) => (
                  <TableRow key={index}>
                    <TableCell>{notification.notifications}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
      
      
}

export default Notifications;