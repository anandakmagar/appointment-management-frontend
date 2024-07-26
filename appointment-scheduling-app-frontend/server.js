// Import the required modules
const express = require('express');
const path = require('path');

// Create an express application
const app = express();

// Serve static files from the specific directories
const staticDirectories = ['public', 'contact', 'create', 'fetch', 'home', 'login', 'password-reset', 'request-password-reset'];
staticDirectories.forEach(dir => {
    app.use(express.static(path.join(__dirname, dir)));
});

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Return the login.html file when accessing the /login path
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login', 'login.html')));

// Setup other routes as needed
app.get('/fetch', (req, res) => res.sendFile(path.join(__dirname, 'fetch', 'fetch.html')));
app.get('/create', (req, res) => res.sendFile(path.join(__dirname, 'create', 'create.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact', 'contact.html')));
app.get('/password-reset', (req, res) => res.sendFile(path.join(__dirname, 'password-reset', 'password-reset.html')));
app.get('/request-password-reset', (req, res) => res.sendFile(path.join(__dirname, 'request-password-reset', 'request-password-reset.html')));

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).send('Sorry, we cannot find that!');
});

// Listen on the appropriate port provided by the environment
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
