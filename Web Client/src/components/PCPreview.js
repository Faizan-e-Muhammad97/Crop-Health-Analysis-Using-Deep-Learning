import React from "react";
import { FaFile } from "react-icons/fa";
import "../style/video.css";

const PCPreview = (props) => {
  const pc = props.pc;

  return (
    <div className="pc-container">
      <label>
        <FaFile className="icon" size="30px" />
        {pc.name}
      </label>
      {/* <img
            className="photo-uploaded"
            src={URL.createObjectURL(image)}
            width="100px"
            alt="Photo uploaded"
            style={{ padding: "10px" }}
          /> */}
    </div>
  );
};

export default PCPreview;
