import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ImAttachment } from "react-icons/im";
import { IoSendOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import './Home.css';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const navigate = useNavigate();

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setInputValue(file.name);
      handleClose();
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    setIsZooming(true);
    setTimeout(() => {
      navigate('/input', {
        state: { text: inputValue, file: selectedFile },
      });
    }, 500); // Duration matches the zoom transition
  };

  return (
    <section className={`frontPage ${isZooming ? 'zoomOut' : ''}`}>
      <h3 className="frontpage_heading">What do you want to Transcribe or Translate?</h3>
      <div className="inputDiv">
        <div className="inputField">
          <input
            type="text"
            placeholder="Enter text here"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button onClick={handleShow}>
            <ImAttachment />
          </button>
          <button onClick={handleSubmit}>
            <IoSendOutline />
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Your File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Select a file to upload for transcription or translation:</p>
          <input
            type="file"
            accept="video/*,txt,.doc,.docx,.pdf,audio/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default Home;
