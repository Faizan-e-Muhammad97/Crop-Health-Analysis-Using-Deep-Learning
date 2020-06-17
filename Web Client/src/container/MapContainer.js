import React, { useState } from "react";
import Sidebar from "react-sidebar";
import MapComponent from "../components/MapComponent";
import SidebarContent from "../components/SidebarContentMap.js";
import ImageUploader from "../components/ImageUploader.js";

const MapContainer = (props) => {
  // State 'display' to keep track of what component to display on the page
  const [display, setDisplay] = useState(0);
  // State 'imgExifArray' to keep track of images to display on map
  const [imgExifArray, setImgExifArray] = useState(props.exifData);
  // State 'imgsArray' to keep track of images uploaded
  const [imgsArray, setImgsArray] = useState(props.imgData);
  // // State 'download'
  // const [download, setDownload] = useState(props.imgData);

  //Function for changing state display depending on the link selected on sidebar
  const onDisplayChange = (e, option) => {
    // To prevent page refresh
    e.preventDefault();

    if (option === "map") {
      setDisplay(0);
    }
    if (option === "img") {
      setDisplay(1);
    }
    if (option === "download") {
      console.log("Download: ", imgsArray);
      downloadResults();
    }
  };

  const downloadResults = () => {
    let array = Array.from(imgsArray);
    array.forEach(function (img) {
      let string =
        "http://206798625f76.ngrok.io/download/" +
        img.name.split(".")[0] +
        ".png";

      fetch(string, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((response) => {
        // return response.blob();
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = img.name.split(".")[0] + ".png";
          a.click();
        });
      });
    });
  };

  const onImgUpload = (exifArray, imgs) => {
    console.log(exifArray);
    setImgExifArray(exifArray);
    setImgsArray(imgs);

    props.sendData(exifArray, imgs);
  };

  const onMapUpdated = (update) => {
    setDisplay(0);
  };

  // Content to be displayed on page
  let mainContent;
  if (display === 0) {
    mainContent = <MapComponent imgs={imgExifArray} />;
  } else if (display === 1) {
    mainContent = (
      <ImageUploader
        imgs={imgsArray}
        sendData={onImgUpload}
        sendMapUpdate={onMapUpdated}
      />
    );
  }

  return (
    <Sidebar
      sidebar={
        <SidebarContent
          sendData={onDisplayChange}
          downloadOption={imgsArray !== null ? true : false}
        />
      }
      docked={true}
      styles={{ root: { top: "40px" } }}
    >
      <div>{mainContent}</div>
    </Sidebar>
  );
};

export default MapContainer;
