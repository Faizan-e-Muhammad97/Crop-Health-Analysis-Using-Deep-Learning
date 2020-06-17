import React, { useState } from "react";
import DropDownMenu from "../components/Dropdown";
import { FaRulerCombined } from "react-icons/fa";
import "../style/sidebar.css";

const styles = {
  sidebar: {
    width: 200,
    height: "100%",
    overflow: "hidden",
  },
  sidebarLink: {
    display: "block",
    borderRadius: "5px",
    padding: "16px 0px",
    marginBottom: "10px",
    color: "white",
    fontFamily: "Roboto,Helvetica Neue,Arial,sans-serif;",
    fontSize: "11px",
    fontWeight: "600",
    textDecoration: "none",
    textTransform: "uppercase",
  },
  divider: {
    margin: "8px 0",
    height: 1,
    backgroundColor: "#757575",
  },
  content: {
    padding: "16px",
    height: "100%",
    backgroundColor: "#404040",
  },
};

const SidebarContentHeight = (props) => {
  const style = props.style
    ? { ...styles.sidebar, ...props.style }
    : styles.sidebar;

  // const [selectedValue, setSelectedValue] = useState("Upload Video");

  const dropdownSelection = (e, selection) => {
    props.sendData(e, selection);
  };

  return (
    <div className="sidebar" style={style}>
      <div className="content" style={styles.content}>
        <a
          href="#"
          style={styles.sidebarLink}
          onClick={(e) => {
            props.sendData(e, "height");
          }}
        >
          <FaRulerCombined className="icon" size="15px" />
          Height Analysis
        </a>
        {/* <a
          href=""
          style={styles.sidebarLink}
          onClick={(e) => {
            props.sendData(e, "video");
          }}
        >
          Upload Video
        </a> */}
        <DropDownMenu
          heading={"UPLOAD"}
          items={["Video", "PointCloud"]}
          sendData={dropdownSelection}
        />
      </div>
    </div>
  );
};

export default SidebarContentHeight;
