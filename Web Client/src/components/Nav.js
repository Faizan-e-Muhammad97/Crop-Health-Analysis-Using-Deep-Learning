import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "../style/nav.css";
import "../style/button.css";

const Nav = (props) => {
  const options = ["MAP", "HEIGHT"];
  const defaultOption = options[0];

  //State 'display' to keep track of what container to display on the page
  const [selected, setSelected] = useState(0);

  const onSelectedChange = (option) => {
    if (option.value === "MAP") {
      setSelected(0);
    }
    if (option.value === "HEIGHT") {
      setSelected(1);
    }

    props.sendData(option.value);
  };
  // //Function for changing state display depending on the link selected on the navigation bar
  // const onSelectedChange = (e, option) => {
  //   // To prevent page refresh
  //   e.preventDefault();

  //   if (option === "map") {
  //     setSelected(0);
  //   }
  //   if (option === "height") {
  //     setSelected(1);
  //   }

  //   props.sendData(option);
  // };

  return (
    <div className="navbar">
      <Dropdown
        className="drop"
        options={options}
        onChange={onSelectedChange}
        value={defaultOption}
        placeholder="Select an option"
      />
      ;
      {/* <button
        className="navButton"
        type="button"
        onClick={(e) => {
          onSelectedChange(e, "map");
        }}
      >
        MAP
      </button>
      <button
        className="navButton"
        type="button"
        onClick={(e) => {
          onSelectedChange(e, "height");
        }}
      >
        HEIGHT
      </button> */}
    </div>
  );
};

export default Nav;
