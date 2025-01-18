const express = require("express");
const multer = require("multer");
const { generateTranscript } = require("./transcription");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * Endpoint to handle audio transcription.
 * Accepts an audio file and language as input and returns the transcript.
 */
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  const file = req.file;
  const { language } = req.body;

  if (!file) {
    return res.status(400).json({ error: "Audio file is required." });
  }

  if (!language) {
    return res.status(400).json({ error: "Language is required." });
  }

  try {
    const transcript = await generateTranscript(file.path, file.mimetype, language);
    res.json({ transcript });
  } catch (error) {
    console.error("Error generating transcript:", error);
    res.status(500).json({ error: "Failed to generate transcript." });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
6