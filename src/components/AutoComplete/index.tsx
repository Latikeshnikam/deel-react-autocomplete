import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Fragment,
} from "react";
import useDebounce from "../../hooks/useDebounce";
import useOutsideClick from "../../hooks/useOutsideClick";
import { AutoCompleteProps } from "./IAutoComplete";
import Input from "../Input";
import Dropdown from "../Dropdown";
import "./AutoComplete.scss";

const AutoComplete: React.FC<AutoCompleteProps> = ({ data }) => {
  //vars
  const [inputValue, setInputValue] = useState("");
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  //ref
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleChange = (value: string) => {
    setInputValue(value);
    setShowDropdown(true);
  };

  const handleClick = (value: string) => {
    setInputValue(value);
    setShowDropdown(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilter = useCallback(
    useDebounce((value: string) => {
      if (value) {
        const filtered = data.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
      }
      setLoading(false);
    }, 500),
    [inputValue]
  );

  const handleOutsideClick = () => {
    setShowDropdown(false);
    setFilteredData([]);
  };

  const highlightMatch = (item: string) => {
    const index = item.toLowerCase().indexOf(inputValue.toLowerCase());
    if (index === -1) {
      return item;
    }
    return (
      <Fragment>
        {item.substring(0, index)}
        <span className="highlightStyle">
          {item.substring(index, index + inputValue.length)}
        </span>
        {item.substring(index + inputValue.length)}
      </Fragment>
    );
  };

  useOutsideClick(dropdownRef, handleOutsideClick);

  useEffect(() => {
    setLoading(true);
    debounceFilter(inputValue);
  }, [inputValue, debounceFilter]);

  //To empty filtered data array when input serach value is empty
  useEffect(() => {
    if (inputValue === "") {
      setFilteredData([]);
    }
  }, [inputValue]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="container">
      <div className="inputWrapper">
        <Input
          value={inputValue}
          onChange={(value: string) => handleChange(value)}
          placeholder="Search for countries..."
        />
        {loading && <div className="loader"></div>}
      </div>
      {showDropdown && (
        <Dropdown
          filteredData={filteredData}
          handleClick={handleClick}
          highlightMatch={highlightMatch}
        />
      )}
    </div>
  );
};

export default AutoComplete;
