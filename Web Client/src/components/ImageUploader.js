import React, { useState, useRef } from "react";
import ImagePreview from "./ImagePreview";
import axios from "axios";
import EXIF from "exif-js";
import { Line } from "rc-progress";
import "../style/button.css";
import "../style/image.css";

const ImageUploader = (props) => {
  const fileInput = useRef();
  const [selectedFile, setSelectedFile] = useState(props.imgs);
  const [uploadProgress, setUploadProgress] = useState(null);

  const fileSelectedHandler = (e) => {
    setSelectedFile(e.target.files);
  };

  // const fileRemoveHandler = (e) => {
  //   console.log(selectedFile);
  //   setSelectedFile(null);
  // };

  const convertDMSToDD = (degrees, minutes, seconds, direction) => {
    var dd = degrees + minutes / 60 + seconds / (60 * 60);

    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  };

  const getExifInfo = () => {
    const imgExifArray = [];
    const imageList = Array.from(selectedFile);
    console.log(imageList);

    for (let index = 0; index < imageList.length; index++) {
      let lat, latRef, long, longRef;
      EXIF.getData(imageList[index], function () {
        var exifData = EXIF.pretty(this);
        if (exifData) {
          lat = EXIF.getTag(this, "GPSLatitude");
          latRef = EXIF.getTag(this, "GPSLatitudeRef");
          lat = convertDMSToDD(lat[0], lat[1], lat[2], latRef);

          long = EXIF.getTag(this, "GPSLongitude");
          longRef = EXIF.getTag(this, "GPSLongitudeRef");
          long = convertDMSToDD(long[0], long[1], long[2], longRef);
        } else {
          console.log(
            "No EXIF data found in image '" + imageList[index].name + "'."
          );
        }

        imgExifArray.push({
          name: imageList[index].name,
          url: URL.createObjectURL(imageList[index]),
          lat: lat,
          long: long,
        });
      });
    }

    props.sendData(imgExifArray, selectedFile);
  };

  const fileUploadHandler = () => {
    getExifInfo();
    for (let index = 0; index < selectedFile.length; index++) {
      const element = selectedFile[index];
      const fd = new FormData();
      fd.append(element.name, element, element.name);

      axios
        .post(`http://206798625f76.ngrok.io/api/predict/`, fd, {
          header: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          onUploadProgress: (ProgressEvent) => {
            setUploadProgress(
              Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
            );
            console.log(
              "Upload Progress: " +
                Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
                "%"
            );
          },
        })
        .then((res) => {
          console.log(res);
          setUploadProgress(null);
          props.sendMapUpdate(true);
        });
    }
  };

  return (
    <div className="container">
      {/* <div className="sec-container"> */}
      {uploadProgress !== null ? (
        <div className="img-progress-container">
          <h5>Progress: {uploadProgress} %</h5>
          <Line
            percent={uploadProgress}
            strokeWidth="2"
            strokeColor="#22bb33"
          />
        </div>
      ) : null}

      <div className="img-input-container">
        <input
          style={{ display: "none" }}
          type="file"
          onChange={fileSelectedHandler}
          ref={fileInput}
          multiple
        />
        <button
          className="customButton"
          onClick={() => fileInput.current.click()}
        >
          Select Images
        </button>
        <button className="customButton" onClick={fileUploadHandler}>
          Upload
        </button>
        {/* <button className="customButton" onClick={fileRemoveHandler}>
          Remove All
        </button> */}
      </div>

      {selectedFile !== null ? <ImagePreview imageList={selectedFile} /> : null}
    </div>
  );
};

export default ImageUploader;
