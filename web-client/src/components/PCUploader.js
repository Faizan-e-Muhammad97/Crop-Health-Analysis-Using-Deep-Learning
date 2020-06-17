import React, { useState, useRef } from "react";
import PCPreview from "./PCPreview";
import axios from "axios";
import { Line } from "rc-progress";
import "../style/button.css";
import "../style/video.css";

const PCUploader = (props) => {
  const fileInput = useRef();
  const [selectedFile, setSelectedFile] = useState(props.pc);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [process, setProcess] = useState(null);

  const fileSelectedHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // const fileRemoveHandler = (e) => {
  //   console.log(selectedFile);
  //   setSelectedFile(null);
  // };

  const fileUploadHandler = () => {
    // console.log("upload ", selectedFile);
    // const element = selectedFile;
    // const fd = new FormData();
    // fd.append(element.name, element, element.name);
    // axios
    // .post(`http://206798625f76.ngrok.io/api/predict/`, fd, {
    //     header: {
    //     "Content-type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    //     },
    //     onUploadProgress: (ProgressEvent) => {
    //     setUploadProgress(
    //         Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
    //     );
    //     console.log(
    //         "Upload Progress: " +
    //         Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
    //         "%"
    //     );
    //     },
    // })
    // .then((res) => {
    //     console.log(res);
    //     setUploadProgress(null);
    //     props.sendMapUpdate(true);
    // });
    let x = 0;
    let intervalID = setInterval(function () {
      // Your logic here
      let myObj;
      if (x === 0) {
        myObj = { str: "Uploading Pointcloud: ", num: "30" };
        setProcess(myObj);
      }
      if (x === 1) {
        myObj = { str: "Pre-processing: ", num: "50" };
        setProcess(myObj);
      }
      if (x === 2) {
        myObj = { str: "Height Estimation: ", num: "90" };
        setProcess(myObj);
      }

      console.log(myObj);

      if (++x === 4) {
        window.clearInterval(intervalID);
        console.log("Result");
        props.sendData("result");
      }
    }, 2000);
  };

  return (
    <div className="container">
      {/* <div className="sec-container"> */}
      {process !== null ? (
        <div className="vid-progress-container">
          <h5>
            {process.str}: {process.num} %
          </h5>
          <Line percent={process.num} strokeWidth="2" strokeColor="#22bb33" />
        </div>
      ) : null}

      <div className="vid-input-container">
        <input
          style={{ display: "none" }}
          type="file"
          onChange={fileSelectedHandler}
          ref={fileInput}
        />
        <button
          className="customButton"
          onClick={() => fileInput.current.click()}
        >
          Select File
        </button>
        <button className="customButton" onClick={fileUploadHandler}>
          Upload
        </button>
        {/* <button className="customButton" onClick={fileRemoveHandler}>
            Remove
          </button> */}
      </div>

      {/* {uploadProgress !== null ? (
          <div className="progressContainer">
            <h5>Progress: {uploadProgress} %</h5>
            <Line
              percent={uploadProgress}
              strokeWidth="2"
              strokeColor="#22bb33"
            />
          </div>
        ) : null} */}
      {/* </div> */}

      {selectedFile !== null ? <PCPreview pc={selectedFile} /> : null}
    </div>
  );
};

export default PCUploader;
