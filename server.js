const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// Initialize app and DB
const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('forms.db');

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('views')); // Serve HTML files from 'views' folder

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    amount TEXT,
    reason TEXT,
    repayment_date TEXT,
    contact TEXT,
    bsp_account TEXT,
    date_submitted TEXT
)`);

// POST route to receive data from public website
app.post('/submit', (req, res) => {
    const {
        name,
        amount,
        reason,
        repaymentDate,
        contact,
        bspAccount,
        dateSubmitted
    } = req.body;

    const query = `INSERT INTO forms (name, amount, reason, repayment_date, contact, bsp_account, date_submitted) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [name, amount, reason, repaymentDate, contact, bspAccount, dateSubmitted], function(err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ message: 'Failed to submit form' });
        }
        res.status(200).json({ message: 'Form submitted successfully' });
    });
});

// Route to view all submissions (for admin)
app.get('/submissions', (req, res) => {
    db.all('SELECT * FROM forms ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Database error');
        }

        let html = '<h1>Submitted Forms</h1><ul>';
        rows.forEach(row => {
            html += `<li>
                <strong>Name:</strong> ${row.name} |
                <strong>Amount:</strong> ${row.amount} |
                <strong>Reason:</strong> ${row.reason} |
                <strong>Repayment Date:</strong> ${row.repayment_date} |
                <strong>Contact:</strong> ${row.contact} |
                <strong>BSP Account:</strong> ${row.bsp_account} |
                <strong>Submitted:</strong> ${row.date_submitted}
            </li>`;
        });
        html += '</ul>';
        res.send(html);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
