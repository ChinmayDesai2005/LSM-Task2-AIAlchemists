import { useLocation } from "react-router-dom";
import { useState } from "react";
import './Input.css';

function InputPage() {
  const location = useLocation();
  const { text, file } = location.state || {};
  const [inputValue, setInputValue] = useState(text || (file && file.name) || "");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="inputPage">
      <h1>Input Data</h1>
      <div className="inputField">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Your text or file name here"
        />
      </div>
    </div>
  );
}

export default InputPage;
