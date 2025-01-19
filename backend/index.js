import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client } from 'cassandra-driver';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import axios from 'axios';
import { generateTranscript } from './transcription.js';

dotenv.config({ path: './.env' });
const upload = multer({dest: 'uploads/'});

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: '200mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Astra DB client
const client = new Client({
  cloud: {
    secureConnectBundle: "./secure-connect-levelsupermind.zip",
  },
  credentials: {
    username: process.env.CLIENTID,
    password: process.env.SECRET,
  },
});

client.connect()
  .then(() => console.log('Connected to Astra DB'))
  .catch((error) => console.error('Connection error: ', error));

// Create user and blogs tables if they don't exist
const createUserTable = `
  CREATE TABLE IF NOT EXISTS levelsupermind.user (
    id UUID PRIMARY KEY,
    email TEXT,
    username TEXT,
    password TEXT
  );
`;

const createBlogsTable = `
  CREATE TABLE IF NOT EXISTS levelsupermind.blogs (
    id UUID PRIMARY KEY,
    title TEXT,
    content TEXT,
    language TEXT,
    dates TIMESTAMP,
    likes INT,
    dislikes INT,
    views INT
  );
`;

client.execute(createUserTable)
  .then(() => console.log('User table ensured'))
  .catch((error) => console.error('Error creating user table: ', error));

client.execute(createBlogsTable)
  .then(() => console.log('Blogs table ensured'))
  .catch((error) => console.error('Error creating blogs table: ', error));


const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "Access Denied, No Token Provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createQuery = 'INSERT INTO levelsupermind.user (id, email, username, password) VALUES (uuid(), ?, ?, ?) RETURNING id';
  const fetchQuery = 'SELECT * FROM levelsupermind.user WHERE id = ?';

  try {
    const result = await client.execute(createQuery, [email, username, hashedPassword], { prepare: true });
    const newUserId = result.rows[0].id;

    const fetchResult = await client.execute(fetchQuery, [newUserId], { prepare: true });
    const newUser = fetchResult.rows[0];

    const token = jwt.sign({ id: newUser.id, email: newUser.email, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token,
    });
  } catch (error) {
    console.error('Error registering user', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});


app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const fetchQuery = 'SELECT * FROM levelsupermind.user WHERE email = ? ALLOW FILTERING';

  try {
    const result = await client.execute(fetchQuery, [email], { prepare: true });
    if (result.rowLength === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.json({
      message: 'Logged in successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Error signing in', error);
    res.status(500).json({ message: 'Error signing in', error });
  }
});


// app.post('/blog', authenticateJWT, (req, res) => {
//   const { title, content, language } = req.body;

//   if (!title || !content || !language) {
//     return res.status(400).json({ message: 'Title, content, and language are required' });
//   }

//   const query = 'INSERT INTO levelsupermind.blogs (id, title, content, language, dates, likes, dislikes, views) VALUES (uuid(), ?, ?, ?, toTimestamp(now()), 0, 0, 0)';
//   client.execute(query, [title, content, language], { prepare: true })
//     .then(() => res.status(201).json({ message: 'Blog created successfully' }))
//     .catch((error) => res.status(500).json({ message: 'Error creating blog', error }));
// });


app.post('/blog', authenticateJWT, async (req, res) => {
  const { title, content, language } = req.body;

  if (!title || !content || !language) {
    return res.status(400).json({ message: 'Title, content, and language are required' });
  }

  try {
    // Beautify the markdown content
    const beautifyResponse = await axios.post('http://localhost:5000/v1/beautify/markdown', { content });
    const beautifiedContent = beautifyResponse.data.content;

    // Translate the beautified content
    const translateResponse = await axios.post(
      'http://localhost:5000/v1/translate/',
      { content: beautifiedContent },
      { headers: { 'Content-Type': 'application/json' } } 
    );

    const translations = translateResponse.data.translations;

    // Create blogs in the database
    const createdBlogs = [];

    for (const translation of translations) {
      const newId = uuidv4();
      const insertQuery = `
        INSERT INTO levelsupermind.blogs (id, title, content, language, dates, likes, dislikes, views) 
        VALUES (?, ?, ?, ?, toTimestamp(now()), 0, 0, 0)
      `;

      await client.execute(insertQuery, [newId, title, translation.content, translation.language], { prepare: true });

      const blogEntry = {
        id: newId,
        title,
        content: translation.content,
        language: translation.language,
        dates: new Date(),
        likes: 0,
        dislikes: 0,
        views: 0,
      };

      createdBlogs.push(blogEntry);
    }

    // Respond with the created blogs
    res.status(201).json({
      message: 'Blogs created successfully',
      blogs: createdBlogs,
    });
  } catch (error) {
    console.error('Error creating blogs:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error creating blogs', error });
  }
});


app.delete('/blog/:id', authenticateJWT, (req, res) => {
  const blogId = req.params.id;

  const query = 'DELETE FROM levelsupermind.blogs WHERE id = ?';
  client.execute(query, [blogId], { prepare: true })
    .then(() => res.json({ message: 'Blog deleted successfully' }))
    .catch((error) => res.status(500).json({ message: 'Error deleting blog', error }));
});

app.get('/blog/:id/analysis', async (req, res) => {
  const blogId = req.params.id;

  // Fetch views, likes, dislikes for the blog
  const blogQuery = 'SELECT views, likes, dislikes FROM levelsupermind.blogs WHERE id = ?';
  try {
    const blogResult = await client.execute(blogQuery, [blogId], { prepare: true });
    if (blogResult.rowLength === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const blog = blogResult.rows[0];
    const views = blog.views;
    const likes = blog.likes;
    const dislikes = blog.dislikes;

    // Fetch number of comments for the blog
    // const commentsQuery = 'SELECT count(*) as comment_count FROM levelsupermind.comments WHERE blog_id = ?';
    // const commentsResult = await client.execute(commentsQuery, [blogId], { prepare: true });
    // const commentCount = commentsResult.rows[0].comment_count;

    // Prepare the analysis response
    const analysis = {
      blogId,
      views,
      likes,
      dislikes,
    //   commentCount
    };

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog analysis', error });
  }
});

app.post('/blog/:id/view', async (req, res) => {
  const blogId = req.params.id;

  const query = 'UPDATE levelsupermind.blogs SET views = views + 1 WHERE id = ?';
  try {
    await client.execute(query, [blogId], { prepare: true });
    res.json({ message: 'Blog view incremented successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing views', error });
  }
});

// Controller for incrementing likes
app.post('/blog/:id/like', async (req, res) => {
  const blogId = req.params.id;

  const query = 'UPDATE levelsupermind.blogs SET likes = likes + 1 WHERE id = ?';
  try {
    await client.execute(query, [blogId], { prepare: true });
    res.json({ message: 'Blog liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing likes', error });
  }
});

// Controller for incrementing dislikes
app.post('/blog/:id/dislike', async (req, res) => {
  const blogId = req.params.id;

  const query = 'UPDATE levelsupermind.blogs SET dislikes = dislikes + 1 WHERE id = ?';
  try {
    await client.execute(query, [blogId], { prepare: true });
    res.json({ message: 'Blog disliked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing dislikes', error });
  }
});

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


app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT || 8000}`);
});


