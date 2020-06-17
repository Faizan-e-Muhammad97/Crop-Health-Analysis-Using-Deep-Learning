import React, { useState } from "react";
import { FaCaretDown, FaUpload } from "react-icons/fa";
import "../style/dropdown.css";

const Dropdown = (props) => {
  const [displayMenu, setDisplayMenu] = useState(false);

  const toggleMenu = (e) => {
    e.preventDefault();

    if (displayMenu) setDisplayMenu(false);
    else setDisplayMenu(true);
  };

  const selectedItem = (e, item) => {
    props.sendData(e, item.item);
  };

  const menuItems = () => {
    let items = [];
    return props.items.map((item) => (
      <li>
        <a href="#" onClick={(e) => selectedItem(e, { item })}>
          {item}
        </a>
      </li>
    ));
  };

  return (
    <div className="dropdown">
      <div className="button" onClick={toggleMenu}>
        <FaUpload className="icon" size="20px" />
        {props.heading}
        <FaCaretDown className="icon" size="20px" />
      </div>

      <div className={displayMenu ? "show-options" : "hide-options"}>
        {displayMenu ? <ul className="item-list">{menuItems()}</ul> : null}
      </div>
    </div>
  );
};

export default Dropdown;
