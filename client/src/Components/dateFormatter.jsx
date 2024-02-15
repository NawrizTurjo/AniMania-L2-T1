import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";

function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState("");

  const handleInputChange = (event) => {
    setVideoUrl(event.target.value);
  };

  return (
    <div>
      {/* <input
        type="text"
        value={videoUrl}
        onChange={handleInputChange}
        placeholder="Enter video URL"
      />
      {videoUrl && (
        <video controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )} */}
      <ReactPlayer
        url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
        // controls={false}
        // width="100%"
        // height="auto"
        // style={{ maxWidth: "600px" }}
      />
    </div>
  );
}

export default VideoPlayer;
