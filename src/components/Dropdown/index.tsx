import React from "react";
import "./Dropdown.scss";

const Dropdown: React.FC<{
  filteredData: string[];
  handleClick: (value: string) => void;
  highlightMatch: (item: string) => React.ReactNode;
}> = ({ filteredData, handleClick, highlightMatch }) => (
  <ul className="listStyle">
    {!filteredData?.length ? (
      <li className="noMatch">No match records found</li>
    ) : (
      filteredData.map((item, index) => (
        <li
          key={index}
          className="listItemStyle"
          style={{
            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
          }}
          onClick={() => handleClick(item)}
        >
          {highlightMatch(item)}
        </li>
      ))
    )}
  </ul>
);

export default Dropdown;
