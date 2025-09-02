const http = require('http');
const dbConnection = require('./dbConnection');
const authRoutes = require('./routes/authRoutes');
const puzzleController = require('./controllers/puzzleController');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const port = process.env.SERVER_PORT;
require('dotenv').config();

const address = '127.0.0.1';
const oneDay = 1000 * 24 * 60 * 60;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));
app.use(sessions({
  secret: "secretkeyhehexd123",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/puzzles', puzzleController);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/loginLanding.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/registerLanding.html');
});

app.get('/puzzles', (req, res) => {
  res.sendFile(__dirname + '/views/puzzles.html');
});

app.get('/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/finalpage', (req, res) => {
  res.sendFile(__dirname + '/views/finalpage.html');
});


const server = http.createServer(app);
server.listen(port, address, () => {
  console.log(`Server is running on localhost:` + port);
});

process.on('exit', () => {
  dbConnection.end();
});
