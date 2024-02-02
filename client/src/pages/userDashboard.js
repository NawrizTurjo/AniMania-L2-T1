import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { storage } from "./FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useLocation } from "react-router";
import axios from "axios";
import { Box, Button, Paper, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import Button from "@mui/material/Button";
// import Paper from "@mui/material/Paper";
import { motion } from "framer-motion/dist/framer-motion";


function UserDashboard() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  let location = useLocation();
  let state = location.state;

  let [user, setUser] = useState("");
  let [person, setPerson] = useState({});
  let [loading, setLoading] = useState(true);
  let [name,setName]=useState("");
  let [bio,setBio]=useState("");
  let [most_favourite_anime,setMostFavouriteAnime]=useState("");
  let [first_access,setFirstAccess]=useState("");
  let [last_access,setLastAccess]=useState("");
  let [active_time,setActiveTime]=useState("");


  user = state && state.user;
  let email = state && state.email;
  let [img_url, setImgUrl] = useState("");

//   console.log(user);
//   console.log(email);
const formatActiveTime = (activeTime) => {
    const totalMilliseconds =
      activeTime.hours * 3600000 +
      activeTime.minutes * 60000 +
      activeTime.seconds * 1000 +
      activeTime.milliseconds;
  
    const months = Math.floor(totalMilliseconds / (30 * 24 * 60 * 60 * 1000));
    const days = Math.floor(totalMilliseconds / (24 * 60 * 60 * 1000)) % 30;
    const hours = Math.floor(totalMilliseconds / (60 * 60 * 1000)) % 24;
    const minutes = Math.floor(totalMilliseconds / (60 * 1000)) % 60;
    const seconds = Math.floor(totalMilliseconds / 1000) % 60;
  
    return `${months} month(s) ${days} day(s) ${hours} hour(s) ${minutes} minute(s) ${seconds} second(s)`;
  };
  

  let getPerson = async () => {
    // e.preventDefault();
    try {
      console.log(email);
      let response = await axios.post(
        `http://localhost:3000/userDash`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      let personData = response.data[0];

      person = {
        // user: personData?.user_name || "",
        name: personData?.name || "",
        img_url: personData?.img_url || "",
        bio: personData?.bio || "",
        most_favourite_anime: personData?.most_favourite_anime || "",
        first_access: personData?.first_access || 0,
        last_access: personData?.last_access || 0,
        active_time: formatActiveTime(personData?.active_time || {}),
      };
      console.log(person);
      console.log(person.img_url);
      setPerson(person);
      setActiveTime(person.activeTime);
      setBio(person.bio);
      setFirstAccess(person.first_access);
      setLastAccess(person.last_access);
      setMostFavouriteAnime(person.most_favourite_anime);
      setName(person.name);
      setLoading(false);
      setUrl(personData?.img_url || "");
      console.log(url);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getPerson();
  }, []);

  const handleImageChange = async(e) => {
    if (e.target.files[0]) {
      await setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const imageRef = ref(storage,`files/${v4()}`)
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
            console.log(url);
            updateImg({url});
            setImgUrl(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
        setImage(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  

  const updateImg = async({url})=>{
    // e.preventDefault();
    console.log(url);
    try {
      let response = await axios.put(
        `http://localhost:3000/userDash`,
        JSON.stringify({ url, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      let updatedImageUrl = response.data[0].img_url;
      setUrl(updatedImageUrl); // Update img_url in state
      console.log(updatedImageUrl);
      localStorage.setItem("img_url", updatedImageUrl);
    //   setUser(name);
    //   localStorage.setItem("user", name);
    //   console.log(name);
    } catch (err) {
      console.error(err.message);
    }
  };

//   if(person.img_url!=="")
//   {
//     return (<>
//         <Avatar src={person.img_url} sx={{ width: 150, height: 150 }} />
//     </>)
//   }


  

return (
  <motion.div style={{ display: "flex", justifyContent: "flex-start" }}
  initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 ,transition: { duration: 0.5 }}}>
    {loading ? (
      <h2>Loading...</h2>
    ) : (
      <>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "20px" }}>
          <Avatar src={url} sx={{ width: 120, height: 120, marginBottom: "8px" }} />
          <input type="file" onChange={handleImageChange} />
          <Button variant="contained" disableElevation onClick={handleSubmit} size="small" startIcon={<CloudUploadIcon />} style={{ marginTop: "8px" }}>
            Update Image
          </Button>
          <Paper elevation={3} style={{ width: "400px", padding: "20px", border: "0.5px solid #cccccc", marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
  <Typography variant="h5" component="h2" style={{ fontWeight: "bold", marginBottom: "15px" }}>
    {user}'s Anime List
  </Typography>
  {/* Other content */}
</Paper>          <div style={{ border: "0.5px solid #cccccc", width: "400px", height: "500px", marginTop: "10px", marginRight: "auto", overflow: "auto" }}>
            {/* Content of the box */}
          </div>
        </div>

        {/* First Vertical Line */}
        <div style={{ borderLeft: "0.5px solid #cccccc", height: "800px", margin: "10px" }}></div>

        {/* Box on the left of the first vertical line */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "60px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  <h1 style={{ marginTop: "0px" }}>Welcome to the User Dashboard</h1>
  <h1 style={{ marginTop: "10px" }}>Hello!!!  {name}</h1>
</div>

          <Paper elevation={3} style={{ width: "500px", padding: "20px", border: "0.5px solid #cccccc", marginTop: "60px" }}>
            <h2>{name}'s Profile</h2>
            
            <p><strong>Bio:</strong> {bio}</p>
            <p><strong>Most Favourite Anime:</strong> {most_favourite_anime}</p>
            <p><strong>First Access:</strong> {first_access}</p>
            <p><strong>Last Access:</strong> {last_access}</p>
            <p><strong>Active Time:</strong> {active_time}</p>
          </Paper>
        </div>

        {/* Second Vertical Line */}
        <div style={{ borderLeft: "0.5px solid #cccccc", height: "800px", margin: "10px" }}></div>

        {/* Box below the Update Profile button */}
        
        <div style={{ position: "relative" }}>
  <Paper elevation={3} style={{ position: "absolute", top: "230px", left: "50%", transform: "translateX(-50%)", zIndex: 1, width: "400px", padding: "20px", border: "0.5px solid #cccccc", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
    <Typography variant="h5" component="h2" style={{ fontWeight: "bold", marginBottom: "15px" }}>
      {user}'s Watch History
    </Typography>
    {/* Other content */}
  </Paper>

  <div style={{ border: "0.5px solid #cccccc", width: "400px", height: "500px", marginTop: "330px", marginLeft: "auto", overflow: "auto" }}>
    {/* Content of the box */}
  </div>
</div>

      </>
    )}
  </motion.div>
);
}

export default UserDashboard;

export const uploadImage = async (imageFile) => {
    const imageRef = ref(storage, `files/${v4()}`);
    try {
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.log("Error uploading image:", error);
      throw error;
    }
};

// export const uploadImage = async (image) => {
//     const imageRef = ref(storage,`files/${v4()}`)
//     uploadBytes(imageRef, image)
//       .then(() => {
//         getDownloadURL(imageRef)
//           .then((url) => {
//             // setUrl(url);
//             // console.log(url);
//             // updateImg({url});
//             return url;
//           })
//           .catch((error) => {
//             console.log(error.message, "error getting the image url");
//           });
//         // setImage(null);
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });
// };