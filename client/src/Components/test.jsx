import axios from "axios";
import React, { useEffect, useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button } from "react-bootstrap";

export default function Test() {
  let userRole = localStorage.getItem("userRole");

  const [isNotification, setIsNotification] = useState([]);
  const getUnseenNotifications = async (email) => {
    try {
      console.log("Getting unseen notifications");
      console.log(email);
      const res = await axios.post(
        `http://localhost:3000/unseenNotifications`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(2);
      console.log(res.data);
      console.log(res.data[0].is_unseen);
      if (res.data[0].is_unseen === "TRUE") {
        setIsNotification(true);
        // console.log("a");
        console.log(userRole);
      } else {
        setIsNotification(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    let email = localStorage.getItem("email");
    getUnseenNotifications(email);
  }, []);

  return (
    <div>
      {userRole === "U" && (
        <Button
          variant="contained"
          style={{ border: "none" }}
          //   onClick={() => {
          //     navigate("/notifications");
          //   }}
        >
          {isNotification ? <NotificationsIcon /> : <NotificationsNoneIcon />}
          {/* <NotificationsIcon /> */}
        </Button>
      )}
    </div>
  );
}
