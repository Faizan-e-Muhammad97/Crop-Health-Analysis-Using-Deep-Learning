import React, { useState, useRef } from "react";
import image from "../imgs/rasterRGB.jpeg";
import "../style/height.css";

const HeightComponent = (props) => {
  let content;
  if (props.display === 0) {
    content = (
      <div className="message">
        <p>Height Analysis results will be shown here</p>
      </div>
    );
  } else if (props.display === 1) {
    content = (
      <div className="sec-container">
        <div className="image-container">
          <p>RESULT</p>
          <img
            className="raster-image"
            src={image}
            width="512px"
            alt="Raster Image"
            style={{ padding: "10px" }}
          />
        </div>
        <div className="table-container">
          <table className="analysis">
            <tr>
              <th colSpan={2}>RESULT STATISTICS</th>
            </tr>
            <tr>
              <td>Date</td>
              <td>March 10, 2020</td>
            </tr>
            <tr>
              <td>Crop Type</td>
              <td>Wheat</td>
            </tr>
            <tr>
              <td colSpan={2}>Height Scale (cm)</td>
            </tr>
            <tr>
              <td>Red</td>
              <td>&gt;45</td>
            </tr>
            <tr>
              <td>Yellow</td>
              <td>45-42</td>
            </tr>
            <tr>
              <td>Green</td>
              <td>42-38</td>
            </tr>
            <tr>
              <td>Cyan</td>
              <td>42-5</td>
            </tr>
            <tr>
              <td>Blue</td>
              <td>&lt;5</td>
            </tr>
            <tr>
              <td>Number of Points</td>
              <td>110969</td>
            </tr>
            <tr>
              <td>Actual Height (cm)</td>
              <td>38</td>
            </tr>
            <tr>
              <td>Estimated Height (cm)</td>
              <td>42</td>
            </tr>
            <tr>
              <td>Difference in Height(%)</td>
              <td>10.5</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }

  return <div className="container">{content}</div>;
};

export default HeightComponent;
