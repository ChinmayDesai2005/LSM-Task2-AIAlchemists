import React, { useState } from 'react';
import axios from 'axios';
import './Transcript.css';

const Transcript = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !language) {
      setError('Both file and language are required.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('language', language);

    try {
      const response = await axios.post('http://localhost:3001/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTranscript(response.data.transcript);
      setError('');
    } catch (err) {
      setError('Failed to generate transcript.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Upload Audio File for Transcription</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Audio File:</label>
          <input type="file" accept="audio/*" onChange={handleFileChange} />
        </div>
        <div>
          <label>Language:</label>
          <input type="text" value={language} onChange={handleLanguageChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {transcript && (
        <div>
          <h2>Transcript:</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default Transcript;