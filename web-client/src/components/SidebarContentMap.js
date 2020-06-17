import React from "react";
import { FaMapMarkedAlt, FaImages, FaDownload } from "react-icons/fa";
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

const SidebarContentMap = (props) => {
  const style = props.style
    ? { ...styles.sidebar, ...props.style }
    : styles.sidebar;

  return (
    <div className="sidebar" style={styles.sidebar}>
      <div className="content" style={styles.content}>
        <a
          href="#"
          style={styles.sidebarLink}
          onClick={(e) => {
            props.sendData(e, "map");
          }}
        >
          <FaMapMarkedAlt className="icon" size="20px" />
          Map Analysis
        </a>
        <a
          href=""
          style={styles.sidebarLink}
          onClick={(e) => {
            props.sendData(e, "img");
          }}
        >
          <FaImages className="icon" size="20px" />
          Upload Images
        </a>
        {props.downloadOption ? (
          <a
            href=""
            style={styles.sidebarLink}
            onClick={(e) => {
              props.sendData(e, "download");
            }}
          >
            <FaDownload className="icon" size="20px" />
            Download
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default SidebarContentMap;
