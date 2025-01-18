const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const { GoogleAIFileManager } = require("@google/generative-ai/server");
  
  const apiKey = 'AIzaSyCiUJ09b-JkA-sVW4dbXUhfxBESntEIDB0';
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  
  /**
   * Uploads the given file to Gemini.
   *
   * @param {string} path - Path to the file.
   * @param {string} mimeType - MIME type of the file.
   * @returns {Promise<Object>} - Uploaded file metadata.
   */
  async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    return uploadResult.file;
  }
  
  /**
   * Generates a transcript for the uploaded audio file.
   *
   * @param {string} filePath - Path to the audio file.
   * @param {string} mimeType - MIME type of the audio file.
   * @param {string} language - Language for transcription.
   * @returns {Promise<string>} - Generated transcript.
   */
  async function generateTranscript(filePath, mimeType, language = "english") {
    const file = await uploadToGemini(filePath, mimeType);
  
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Your task is to take audio files as input and generate transcripts.",
    });
  
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
  
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: file.mimeType,
                fileUri: file.uri,
              },
            },
            { text: `Generate a transcript in ${language}` },
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("Please transcribe the audio.");
    return result.response.text();
  }
  
  module.exports = { generateTranscript };