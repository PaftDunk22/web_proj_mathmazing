const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();
const dbConnection = require('../dbConnection');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static('public'));

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const query = 'SELECT id, username, password FROM users WHERE username = ?';
        dbConnection.query(query, [username], async (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).send('Database error');
            }

            if (results.length === 0) {
                return res.status(401).send('Invalid credentials');
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                req.session.username = user.username;
                req.session.userId = user.id;
                res.redirect('/puzzles');
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Authentication error');
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const usernameExistsQuery = 'SELECT id FROM users WHERE username = ?';
        dbConnection.query(usernameExistsQuery, [username], async (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).send('Database error');
            }

            if (results.length > 0) {
                return res.status(400).send('Username already exists');
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            dbConnection.query(insertUserQuery, [username, hashedPassword], (insertError) => {
                if (insertError) {
                    console.error('Database insert error:', insertError);
                    res.status(500).send('Database error');
                } else {
                    res.redirect('/login');
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Registration error');
    }
});

process.on('exit', () => {
    dbConnection.end();
});

module.exports = router;
