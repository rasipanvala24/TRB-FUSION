// // filepath: server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();
// const corsOptions={
//     origin:"http://localhost:5173",
//     methods:"GET,POST",
//     credentials:true,
// };
// app.use(cors(corsOptions));
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/dbtrb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // Example Model
// const Register = mongoose.model('Register', new mongoose.Schema({
//   name: String,
//   email: String,
//   mobile: String,
//   password: String
// }), 'users'); 

// // Example Route
// app.post('/api/auth/login', async (req, res) => {
//     try {
//         const { name, email, mobile, password } = req.body;
//         const newUser = new Register({ name, email, mobile, password });
//         await newUser.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Error registering user' });
//     }
// });
// app.listen(5000, () => console.log('Server running on port 5000'));

// filepath: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS setup to allow requests from your frontend
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,POST",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dbtrb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// Schema and Model for Users
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    password: String
});

// Explicitly set collection name to 'users'
const Register = mongoose.model('Register', userSchema, 'users');

// ================= Signup Route =================
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Check if user already exists
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user
        const newUser = new Register({ name, email, mobile, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// ================= Login Route =================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists with given email & password
        const user = await Register.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// ================= Start Server =================
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
