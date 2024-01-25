import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { storage } from "./FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useLocation } from "react-router";
import axios from "axios";

function UserDashboard() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  let location = useLocation();
  let state = location.state;

  let [user, setUser] = useState("");
  let [person, setPerson] = useState({});
  let [loading, setLoading] = useState(true);

  user = state && state.user;
  let email = state && state.email;

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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
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
    <div className="App">
        {loading ? (
        <h2>Loading...</h2>
      ) : (<>
      <Avatar src={url} sx={{ width: 150, height: 150 }} />
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleSubmit}>Submit</button></>
      )}
    </div>
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