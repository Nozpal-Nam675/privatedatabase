const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// Handle form submission
app.post('/api/submit-form', (req, res) => {
  const { name, amount, reason, repaymentDate, contact, bspAccount } = req.body;

  if (!name || !amount || !reason || !repaymentDate || !contact || !bspAccount) {
    return res.status(400).send('All fields are required.');
  }

  db.insertForm(name, amount, reason, repaymentDate, contact, bspAccount)
    .then(() => res.send('Form submitted successfully!'))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error saving form.');
    });
});

// Admin data view
app.get('/admin-data', (req, res) => {
  db.getAllForms()
    .then(forms => res.json(forms))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error retrieving data.');
    });
});

// Admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
