require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: "*",  // OR specify frontend URL like "https://company-assignment-35iq.vercel.app"
  methods: ["GET", "POST", "PATCH", "DELETE"]
}));

// ✅ Correct MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Test Route
app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: 'pending' },
  priority: { type: String, default: 'medium' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Ensure password is hashed before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(400).send({ error: error.message });
  }
});


app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password); // Log input data

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      throw new Error("Invalid credentials");
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    console.log("Generated token:", token);

    res.send({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).send({ error: error.message });
  }
});

// Task Routes
app.post('/api/tasks', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.user.userId });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// const cors = require('cors');
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));


// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
