const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('forms.db');

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS customer_forms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      amount TEXT,
      reason TEXT,
      repayment_date TEXT,
      contact TEXT,
      bsp_account TEXT,
      date_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = {
  insertForm: (name, amount, reason, repaymentDate, contact, bspAccount) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO customer_forms (name, amount, reason, repayment_date, contact, bsp_account) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, amount, reason, repaymentDate, contact, bspAccount],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },

  getAllForms: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM customer_forms ORDER BY date_submitted DESC`, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};
