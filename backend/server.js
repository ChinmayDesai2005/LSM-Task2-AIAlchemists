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

