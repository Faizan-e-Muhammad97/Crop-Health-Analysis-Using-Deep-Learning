import React from "react";
import "../style/image.css";

const ImagePreview = (props) => {
  const imageList = Array.from(props.imageList);

  return (
    <div className="photo-container">
      {imageList.map((image) => (
        <div className="singlePhoto">
          <img
            className="photo-uploaded"
            src={URL.createObjectURL(image)}
            width="200px"
            alt="Photo uploaded"
            style={{ padding: "20px" }}
          />
          <p>{image.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
