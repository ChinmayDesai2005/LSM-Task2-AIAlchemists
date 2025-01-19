import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "@uiw/react-md-editor";
import { IoSendOutline } from "react-icons/io5";
import "./Input.css";
import axios from "axios";

function InputPage() {
  const location = useLocation();
  const { text, file } = location.state || {};
  const [transcript, setTranscript] = useState(text || (file && file.name) || ""); // Default to file name if no text
  const [markdown, setMarkdown] = useState();
  const [currentStage, setCurrentStage] = useState(1);
  const [inputValue, setInputValue] = useState(text || file || "");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [title, setTitle] = useState('');

  const handleTranscriptChange = (event) => {
    setTranscript(event.target.value);
  };

  const handleMarkdownChange = (value) => {
    setMarkdown(value || "");
  };

  useEffect(() => {
    if (file) {
      const handleSubmit = async (e) => {
          if (!file || !inputValue) {
          setError('Both file and language are required.');
          return;
        }

        setLoading(true);  // Show loading indicator
        console.log("Sending file to server:", file);  // Debugging step

        const formData = new FormData();
        formData.append('audio', file); // Add the file to FormData
        formData.append('language', inputValue);

        try {
          const response = await axios.post('http://localhost:8000/transcribe', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setTranscript(response.data.transcript);
          setError('');
          setLoading(false);  // Hide loading indicator when done
        } catch (err) {
          setError('Failed to generate transcript.');
          setLoading(false);  // Hide loading indicator on error
          console.error(err);
        }
      };

      handleSubmit();  // Trigger file transcription when file is available
    }
  }, [file, inputValue]);  // Re-run effect when file or inputValue changes

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setCurrentStage(1); // Reset to Stage 1 on input field update
  };

  const convertToMarkdown = async() => {
    console.log("Converting to Markdown:", transcript);
      const beautifyResponse = await axios.post('http://localhost:5000/v1/beautify/markdown', { content: transcript });
      console.log("Beautified content:", beautifyResponse.data.content);
      const beautifiedContent = beautifyResponse.data.content;
      setMarkdown(beautifiedContent.split('"')[1].replace(/\\n/g, '\n'));
    goToNextStage();
  };

  const handleUpdatedSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      setCurrentStage(1);
      setTranscript(inputValue);
    }
  };

  const goToNextStage = async() => {
    if (currentStage < 3) setCurrentStage(currentStage + 1);
  };

  const goToPreviousStage = () => {
    if (currentStage > 1) setCurrentStage(currentStage - 1);
  };

  const publishBlog = () => {
    
    try {
      axios.post('http://localhost:8000/blog', {
        title,
        content: markdown,
        ca
      });
      alert('Blog published successfully!');
    }
    
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
            disabled={loading}  // Disable while loading
          />
          {loading && <p>Loading...</p>}  {/* Show loading text */}
          <button onClick={convertToMarkdown} disabled={loading}>Next</button>
        </div>
      )}

      {currentStage === 2 && (
        <div className="markdownSection">
          <h2>Step 2: Edit Markdown</h2>
          <MDEditor
            value={markdown}
            onChange={handleMarkdownChange}
            style={{ height: "500px", marginBottom: "20px" }}
          />
          <button onClick={goToPreviousStage}>Back</button>
          <button onClick={goToNextStage}>Next</button>
        </div>
      )}

      {currentStage === 3 && (
        <div className="previewSection">
          <h2>Step 3: Preview & Publish</h2>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add Your title Here"
            disabled={loading}  // Disable while loading
          />
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
