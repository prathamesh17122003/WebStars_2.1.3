const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const app = express();
const port = 5000;
const storage = multer.diskStorage({
     destination: function (req, file, cb) {
        return cb(null, "./AuctionImage")
     },
     filename: function (req, file, cb) {
        return cb(null, `${file.originalname}`)
     }
});
const upload = multer({storage})

// Middleware for parsing form data
app.use('/images', express.static('./AuctionImage'));
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

app.post('/api/createAuction', upload.single('file'), (req, res) => {
    const { uid, title, description, category, startingPrice, reservePrice, maxBids, auctionStarts, auctionEnds, file } = req.body;
    // Check if files were uploaded
    if (!req.file || req.file.length === 0) {
        return res.json({ error: 'No files were uploaded' });
    }
    console.log('File uploaded:', req.file.originalname);

    // Insert auction details into database
    connection.query('INSERT INTO auction_dets (uid, title, description, category, startPrice, increment, maxBids, startTime, endTime, image, bids, currentVal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)', 
        [uid, title, description, category, startingPrice, reservePrice, maxBids, auctionStarts, auctionEnds, req.file.originalname, startingPrice], 
        (error, results) => {
            if (error) {
                return res.json({ error: 'Error creating auction', details: error });
            }
            res.json({ login: 'success', message: 'Auction created successfully' });
        }
    );
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

app.get('/api/getAuctionDets', (req, res) => {
    const {id, uid} = req.query;
    connection.query(`SELECT * FROM auction_dets where id = ?`, [id], (error, results, fields) => {
        if (error) {
            console.error('Error fetching records:', error);
            return;
        }
        const auction = results;
        connection.query(`SELECT * FROM bid where aid = ?`, [id], (error, results, fields) => {
            if (error) {
                console.error('Error fetching records:', error);
                return;
            }
            const auctions = results;
    
            if (!auction) {
                return res.json({status: 'ok', message: 'Not found any auction'});
            }
            else{
                let totalBids = auctions.length
                connection.query(`SELECT * FROM bid where aid = ? and uid = ?`, [id, uid], (error, results, fields) => {
                    if (error) {
                        console.error('Error fetching records:', error);
                        return;
                    }
                    const auctionsSort = results;
            
                    if (!auction) {
                        return res.json({status: 'ok', message: 'Not found any auction'});
                    }
                    else{
                        let selfBids = 0
                        if (auctionsSort.length) {
                            selfBids = auction[0].maxBids - auctionsSort[0].bidleft
                            
                        }
                        connection.query(`SELECT comment.comment, log_details.name FROM comment JOIN log_details ON comment.uid = log_details.id where comment.aid = ?`, [id], (error, results, fields) => {
                            if (error) {
                                console.error('Error fetching records:', error);
                                return;
                            }
                            const comments = results;
                    
                            if (!auction) {
                                return res.json({status: 'ok', message: 'Not found any auction'});
                            }
                            else{
                                return res.json({records: auction[0], totalBids: totalBids, selfBids: selfBids, comments:comments})
                            }
                        });
                    }
                });
            }
        });
    });
});

app.post('/api/placeBid', (req, res) => {
    const {uid, aid, newVal, bidLeft} = req.body;
    connection.query(`SELECT * FROM bid where uid = ? and aid = ?`, [uid, aid], (error, results, fields) => {
        if (error) {
            console.error('Error fetching records:', error);
            return;
        }
        let auctions = results;
        const auction = auctions.find(auction => auction.bidleft > 0);

        if (!auction) {
            connection.query(`INSERT INTO bid(uid, aid, price, bidleft) VALUES (?,?,?,?)`, [uid, aid, newVal, bidLeft], (error, results, fields) => {
                if (error) {
                    console.error('Error fetching records:', error);
                    return;
                }
                else{
                    connection.query(`UPDATE auction_dets SET currentVal = ? WHERE id = ?`, [newVal, aid], (error, results, fields) => {
                        if (error) {
                            console.error('Error fetching records:', error);
                            return;
                        }
                        else{
                            return res.json({status: 'ok'});
                        }
                    });
                }
            });
        }
        else{
                connection.query(`UPDATE bid SET price = ?, bidleft = ? WHERE uid = ? and aid = ?`, [newVal, auction.bidleft-1, uid, aid], (error, results, fields) => {
                    if (error) {
                        console.error('Error fetching records:', error);
                        return;
                    }
                    else{
                        connection.query(`UPDATE auction_dets SET currentVal = ? WHERE id = ?`, [newVal, aid], (error, results, fields) => {
                            if (error) {
                                console.error('Error fetching records:', error);
                                return;
                            }
                            else{
                                return res.json({status: 'ok'});
                            }
                        });
                    }
                });
        }
    });
});

app.post('/api/addComment', (req, res) => {
    const {uid, aid, commentval} = req.body;
    connection.query(`INSERT INTO comment(uid, aid, comment) VALUES (?,?,?)`, [uid, aid, commentval], (error, results, fields) => {
        if (error) {
            console.error('Error fetching records:', error);
            return;
        }
        else{
            return res.json({status: 'ok'});
        }
    });
});

app.get('/api/getLiveSlider', (req, res) => {
    const currentDate = new Date();
    connection.query(`SELECT * FROM auction_dets where startTime <= ? and endTime >= ?`, [currentDate, currentDate], (error, results, fields) => {
        if (error) {
            console.error('Error fetching records:', error);
            return;
        }
        const auctions = results;

        // Find user by username
        let jsonData = auctions.map(row => {
            return row;
        });
        if (!jsonData) {
            return res.json({status: 'ok', message: 'Not found any auction'});
        }
        else{
            console.log(jsonData)
            return res.json(jsonData)
        }
    });
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
