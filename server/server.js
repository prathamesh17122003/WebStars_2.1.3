const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware for parsing form data
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ["GET", "POST"],
    credentials: true
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'autionex'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to database');
});

// Initialize express-session
app.use(session({
    secret: 'qwertyuiop', // Replace 'your_secret_key' with a long, randomly generated string
    resave: false,
    saveUninitialized: true,
  }));

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username)
    // Fetch records from a table
    connection.query('SELECT * FROM log_details', (error, results, fields) => {
        if (error) {
            console.error('Error fetching records:', error);
            return;
        }
        const users = results;

        // Find user by username
        const user = users.find(user => user.email === username);
        if (!user) {
            return res.json({login: 'denied', message: 'Invalid username or password'});
        }
    
        // Check password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return res.status(401).json({login: 'denied', message: 'Incorrect  password'});
            }
    
            // Start session
            req.session.userId = user.id;
            // req.session.save();
            console.log(req.session.userId)
            res.json({login: 'success', id: req.session.userId});
        });
    });

});

// Protected route
app.post('/api/signup', (req, res) => {
    const { name, username, password } = req.body;
    connection.query('SELECT * FROM log_details', (error, results, fields) => {
        if (error) {
            console.error('Error fetching records:', error);
            return;
        }
        console.log('Fetched records:', results);
        const users = results;

        

        // Find user by username
        const user = users.find(user => user.email === username);
        if (!user) {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ error: 'Error hashing password' });
                }
            
                // Insert user into database
                connection.query('INSERT INTO log_details (name, email, password) VALUES (?, ?, ?)', [name, username, hash], (error, results) => {
                  if (error) {
                    return res.status(500).json({ error: 'Error creating user' });
                  }
                  res.json({login: 'success', message: 'User created'});
                });
            });
        }
        else{
            res.json({login: 'denied', message: 'User already exits'});
        }
    });
});

// Protected route
app.get('/api/protected', (req, res) => {
    if (req.session && req.session.userId) {
        const userId = req.session.userId;
        res.json({login:"success", userId });
    }
    else{
        res.json({login:"denied" });
    }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.send('Logout successful');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
