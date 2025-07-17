<<<<<<< HEAD
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// Endpoint to receive form submissions
app.post('/api/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  db.insertForm(name, email, message)
    .then(() => res.send('Form submitted successfully!'))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error saving form.');
    });
});

// Endpoint to get all submissions for admin
app.get('/admin-data', (req, res) => {
  db.getAllForms()
    .then(forms => res.json(forms))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error retrieving data.');
    });
});

// Serve the admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
=======
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// Endpoint to receive form submissions
app.post('/api/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  db.insertForm(name, email, message)
    .then(() => res.send('Form submitted successfully!'))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error saving form.');
    });
});

// Endpoint to get all submissions for admin
app.get('/admin-data', (req, res) => {
  db.getAllForms()
    .then(forms => res.json(forms))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error retrieving data.');
    });
});

// Serve the admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
>>>>>>> 1c0bcd8e1bb6c197f8f3a229ccb08936abc54a51
