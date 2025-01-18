import { useLocation } from "react-router-dom";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "@uiw/react-md-editor";
import { IoSendOutline } from "react-icons/io5";
import "./Input.css";

function InputPage() {
  const location = useLocation();
  const { text, file } = location.state || {};
  const [transcript, setTranscript] = useState(text || (file && file.name) || "");
  const [markdown, setMarkdown] = useState("# Hello World");
  const [currentStage, setCurrentStage] = useState(1);
  const [inputValue, setInputValue] = useState(text || (file && file.name) || "");

  const handleTranscriptChange = (event) => {
    setTranscript(event.target.value);
  };

  const handleMarkdownChange = (value) => {
    setMarkdown(value || "");
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setCurrentStage(1); // Reset to Stage 1 on input field update
  };

  const convertToMarkdown = () => {
    setMarkdown(transcript);
    goToNextStage();
  };

  const handleUpdatedSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      setCurrentStage(1);
      setTranscript(inputValue);
    }
  }

  const goToNextStage = () => {
    if (currentStage < 3) setCurrentStage(currentStage + 1);
  };

  const goToPreviousStage = () => {
    if (currentStage > 1) setCurrentStage(currentStage - 1);
  };

  const publishBlog = () => {
    alert("Blog Published Successfully!");
    // Add your backend logic here to save/publish the markdown
  };

  return (
    <div className="inputPage">
      <div className="inputField">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Your text or file name here"
        />
        <button onClick={handleUpdatedSubmit} title="Submit">
          <IoSendOutline />
        </button>
      </div>

      {/* Stage Tracker */}
      <div className="stageTracker">
        <div className={`stage ${currentStage >= 1 ? "active" : ""}`}>
          1. Verify Transcript
        </div>
        <div className={`stage ${currentStage >= 2 ? "active" : ""}`}>
          2. Edit Markdown
        </div>
        <div className={`stage ${currentStage === 3 ? "active" : ""}`}>
          3. Preview & Publish
        </div>
      </div>

      {/* Stage Content */}
      {currentStage === 1 && (
        <div className="transcriptSection">
          <h2>Step 1: Verify Transcript</h2>
          <textarea
            value={transcript}
            onChange={handleTranscriptChange}
            placeholder="Verify or edit your transcript here"
          />
          <button onClick={convertToMarkdown}>Next</button>
        </div>
      )}

      {currentStage === 2 && (
        <div className="markdownSection">
          <h2>Step 2: Edit Markdown</h2>
          <MDEditor
            value={markdown}
            onChange={handleMarkdownChange}
            style={{ height: "400px", marginBottom: "20px" }}
          />
          <button onClick={goToPreviousStage}>Back</button>
          <button onClick={goToNextStage}>Next</button>
        </div>
      )}

      {currentStage === 3 && (
        <div className="previewSection">
          <h2>Step 3: Preview & Publish</h2>
          <div className="markdownPreview">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
          <button onClick={goToPreviousStage}>Back</button>
          <button onClick={publishBlog}>Publish Blog</button>
        </div>
      )}
    </div>
  );
}

export default InputPage;
