import React, { useState } from "react";
import Sidebar from "react-sidebar";
import SidebarContent from "../components/SidebarContentHeight.js";
import VideoUploader from "../components/VideoUploader.js";
import PCUploader from "../components/PCUploader.js";
import HeightComponent from "../components/HeightComponent";

const HeightContainer = (props) => {
  //State 'display' to keep track of what component to display on the page
  const [display, setDisplay] = useState(0);
  // State 'resultDisplay' to keep track of what to show in height analysis
  const [resultDisplay, setResultDisplay] = useState(0);

  //Function for changing state display depending on the link selected on sidebar
  const onDisplayChange = (e, option) => {
    // To prevent page refresh
    e.preventDefault();

    if (option === "height") {
      setDisplay(0);
    }
    if (option === "Video") {
      setDisplay(1);
    }
    if (option === "PointCloud") {
      setResultDisplay(1);
      setDisplay(2);
    }
  };

  const onResult = (str) => {
    if (str === "result") {
      setDisplay(0);
    }
  };

  // Content to be displayed on page
  let mainContent;
  if (display === 0) {
    console.log(display);
    mainContent = <HeightComponent display={resultDisplay} />;
  } else if (display === 1) {
    console.log(display);
    mainContent = <VideoUploader video={null} />;
  } else if (display === 2) {
    console.log(display);
    mainContent = <PCUploader pc={null} sendData={onResult} />;
  }

  return (
    <Sidebar
      sidebar={<SidebarContent sendData={onDisplayChange} />}
      docked={true}
      styles={{ root: { top: "40px" } }}
    >
      <div>{mainContent}</div>
    </Sidebar>
  );
};

export default HeightContainer;
