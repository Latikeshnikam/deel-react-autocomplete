import React from "react";
import { InputProps } from "./IInput";
import "./Input.scss";

const Input: React.FC<InputProps> = ({ value, onChange, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="inputStyle"
    />
  );
};

export default Input;
