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
import AnimeList from "../Components/getAnimeList";
import History from "../Components/getHistory";
import { Toaster, toast } from "react-hot-toast";

function UserDashboard() {
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
  const [animeList, setAnimeList] = useState([]);
  const [stat, setStat] = useState(false);
  const [contribution, setContribution] = useState(0);

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
      const days = activeTime.days || 0;
      const hours = activeTime.hours || 0;
      const minutes = activeTime.minutes || 0;
      const seconds = activeTime.seconds || 0;
      const milliseconds = activeTime.milliseconds || 0;
      // const formattedInterval = formatActiveTime(activeTime); // Format the active time
      const formattedActiveTime = `${days} day(s) ${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
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

  const getAnimeList = async () => {
    try {
      console.log(email);
      const res = await axios.post(
        "http://localhost:3000/userDash/getAnimeList",
        { email }
      );
      // console.log(res.data);
      setTimeout(() => {
        setAnimeList(res.data);
      }, 10000);
      console.log(animeList);
      // setLoading(false);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getContribution = async (e) => {
    // e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/getContribution`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res.data);
      setContribution(res.data[0].get_contribution);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getPerson();
    // getAnimeList();
    getContribution();
  }, []);

  useEffect(() => {
    getAnimeList();
  }, [animeList]);

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      await setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const imageRef = ref(storage, `files/${v4()}`);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
            console.log(url);
            updateImg({ url });
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

  const updateImg = async ({ url }) => {
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

  // const saveBio = async (e) => {
  //   e.preventDefault();
  //   console.log(bio);
  //   const loadingToastId = toast.loading("Checking Credentials..", {
  //     duration: 4000, // 4 seconds
  //     style: {
  //       border: "1px solid #282cfc",
  //       padding: "16px",
  //       color: "#282cfc",
  //     },
  //     iconTheme: {
  //       primary: "#282cfc",
  //       secondary: "#FFFAEE",
  //     },
  //   });
  //   try {
  //     let response = await axios.put(
  //       `http://localhost:3000/userDash/updateBio`,
  //       JSON.stringify({ bio, email }),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       }
  //     );
  //     // let updatedBio = response.data[0].bio;
  //     // setBio(updatedBio); // Update img_url in state
  //     // console.log(updatedBio);
  //     localStorage.setItem("bio", bio);
  //     // console.log(animeList)
  //     //   setUser(name);
  //     //   localStorage.setItem("user", name);
  //     //   console.log(name);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  const saveBio = async (e) => {
    e.preventDefault();
    console.log(bio);
    const loadingToastId = toast.loading("Saving Bio..", {
      duration: 1000, // 4 seconds
      style: {
        border: "1px solid #282cfc",
        padding: "16px",
        color: "#282cfc",
      },
      iconTheme: {
        primary: "#282cfc",
        secondary: "#FFFAEE",
      },
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let response = await axios.put(
        `http://localhost:3000/userDash/updateBio`,
        JSON.stringify({ bio, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      localStorage.setItem("bio", bio);
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      toast.success("Bio has been successfully saved.", {
        style: {
          border: "1px solid #282cfc",
          padding: "16px",
          color: "#282cfc",
        },
        iconTheme: {
          primary: "#282cfc",
          secondary: "#FFFAEE",
        },
      });
      setTimeout(() => {
        toast.dismiss();
      }, 5000);
    } catch (err) {
      console.error(err.message);
      toast.dismiss(loadingToastId); // Dismiss the loading toast on error
    }
  };

  const goToHome = () => {
    window.location.href = "/home";
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      console.log(email);
      const response = await axios.put(
        `http://localhost:3000/deleteAccount`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("email");
      console.log(email);
      localStorage.removeItem("userRole");
      localStorage.removeItem("img_url");
      goToHome();
      // setUser("");
      // setEmail("");
      // setUserRole("");
      // setImgUrl("");
      // toggleRerender();

      // navigate("/login");
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
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <motion.div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <Toaster position="top-left" reverseOrder={false} />
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginTop: "20px",
              marginLeft: "0px",
            }}
          >
            <Avatar
              src={url}
              sx={{ width: 120, height: 120, marginBottom: "8px" }}
            />
            <input type="file" onChange={handleImageChange} />
            <Button
              variant="contained"
              disableElevation
              onClick={handleSubmit}
              size="small"
              startIcon={<CloudUploadIcon />}
              style={{ marginTop: "8px" }}
            >
              Update Image
            </Button>
            <Paper
              elevation={3}
              style={{
                width: "500px",
                padding: "20px",
                border: "0.5px solid #cccccc",
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                style={{ fontWeight: "bold", marginBottom: "15px" }}
              >
                {user}'s Anime List
              </Typography>
              {/* Other content */}
            </Paper>{" "}
            <div
              style={{
                border: "0.5px solid #cccccc",
                width: "500px",
                height: "500px",
                marginTop: "10px",
                marginRight: "auto",
                overflow: "auto",
              }}
            >
              {/* Content of the box */}
              <AnimeList />
            </div>
          </div>

          {/* First Vertical Line */}
          <div
            style={{
              borderLeft: "0.5px solid #cccccc",
              height: "800px",
              margin: "10px",
            }}
          ></div>

          {/* Box on the left of the first vertical line */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginTop: "60px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h1 style={{ marginTop: "0px" }}>
                Welcome to the User Dashboard
              </h1>
              <h1 style={{ marginTop: "10px" }}>Hello!!! {name}</h1>
            </div>

            <Paper
              elevation={3}
              style={{
                width: "550px",
                padding: "20px",
                border: "0.5px solid #cccccc",
                marginTop: "60px",
              }}
            >
              <h2>{name}'s Profile</h2>

              {/* <p><strong>Bio:</strong> {bio}</p> */}
              <Box style={{ marginTop: "20px" }}>
                <TextField
                  label="Type your Bio"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={(e) => {
                    saveBio(e);
                  }}
                >
                  Save
                </Button>
              </Box>
              <p>
                <strong>Contributions: </strong> {contribution}
              </p>
              <p>
                <strong>Most Favourite Anime:</strong> {most_favourite_anime}
              </p>
              <p>
                <strong>First Access:</strong> {first_access}
              </p>
              <p>
                <strong>Last Access:</strong> {last_access}
              </p>
              <p>
                <strong>Active Time:</strong> {active_time}
              </p>
              <Button
                variant="contained"
                color="error"
                onClick={(e) => handleDeleteAccount(e)}
              >
                Remove Account
              </Button>
            </Paper>
          </div>

          {/* Second Vertical Line */}
          <div
            style={{
              borderLeft: "0.5px solid #cccccc",
              height: "800px",
              margin: "10px",
            }}
          ></div>

          {/* Box below the Update Profile button */}

          <div style={{ position: "relative" }}>
            <Paper
              elevation={3}
              style={{
                position: "absolute",
                top: "230px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
                width: "450px",
                padding: "20px",
                border: "0.5px solid #cccccc",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                style={{ fontWeight: "bold", marginBottom: "15px" }}
              >
                {user}'s Watch History
              </Typography>
              {/* Other content */}
            </Paper>

            <div
              style={{
                border: "0.5px solid #cccccc",
                width: "450px",
                height: "500px",
                marginTop: "330px",
                marginLeft: "auto",
                overflow: "auto",
              }}
            >
              {/* Content of the box */}
              <History />
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
