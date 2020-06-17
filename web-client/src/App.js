import React, { useState } from "react";
import Nav from "./components/Nav";
import MapContainer from "./container/MapContainer";
import HeightContainer from "./container/HeightContainer";

const App = (props) => {
  //State 'display' to keep track of what container to display on the page
  const [tab, setTab] = useState(0);
  // State 'imgExifArray' to keep track of images to display on map
  const [imgExifArray, setImgExifArray] = useState([]);
  // State 'imgsArray' to keep track of images uploaded
  const [imgsArray, setImgsArray] = useState(null);

  //Function for changing state display depending on the link selected on the navigation bar
  const onTabChange = (option) => {
    if (option === "NDVI") {
      setTab(0);
    }
    if (option === "HEIGHT") {
      setTab(1);
    }
  };

  const saveState = (exifArray, imgs) => {
    setImgExifArray(exifArray);
    setImgsArray(imgs);
  };

  // Content to be displayed on page
  let mainContent;
  if (tab === 0) {
    console.log(tab);
    mainContent = (
      <MapContainer
        exifData={imgExifArray}
        imgData={imgsArray}
        sendData={saveState}
      />
    );
  } else if (tab === 1) {
    console.log(tab);
    mainContent = <HeightContainer />;
  }

  return (
    <div>
      <Nav sendData={onTabChange} />
      <div>{mainContent}</div>
    </div>
  );
};

export default App;
