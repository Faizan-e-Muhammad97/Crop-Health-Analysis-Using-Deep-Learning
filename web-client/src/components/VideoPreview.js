import React from "react";
import "../style/video.css";

const VideoPreview = (props) => {
  const video = props.video;

  return (
    <div className="video-container">
      <video width="600" controls>
        <source src={URL.createObjectURL(video)} type="video/mp4" />
        Your browser does not support HTML video.
      </video>
    </div>
  );
};

export default VideoPreview;
