const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3011;

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'huntdb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Define API routes

// GET all crew members
app.get('/crew', (req, res) => {
  db.query('SELECT * FROM crew', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// GET a crew member by ID
app.get('/crew/:id', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM crew WHERE id = ?', [userId], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

// POST - Create a new crew member
app.post('/crew', (req, res) => {
  const crewMember = req.body;
  const query = 'INSERT INTO crew SET ?';

  db.query(query, crewMember, (error, results) => {
    if (error) throw error;
    res.status(201).json({ message: 'Crew member created successfully', id: results.insertId });
  });
});

// PUT - Update a crew member by ID
app.put('/crew/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
  const query = 'UPDATE crew SET ? WHERE id = ?';

  db.query(query, [updatedUserData, userId], (error) => {
    if (error) throw error;
    res.json({ message: 'Crew member updated successfully' });
  });
});

// DELETE - Delete a crew member by ID
app.delete('/crew/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM crew WHERE id = ?';

  db.query(query, [userId], (error) => {
    if (error) throw error;
    res.json({ message: 'Crew member deleted successfully' });
  });
});

// Function to send email
async function mail() {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "tanmayburadkar7390@gmail.com",
      pass: "wcul llhp onpn kzwb",
    },
  });

  let message = {
    from: "Sender Name <tanmayburadkar7390@gmail.com>",
    to: "Recipient <durudkarkunal@gmail.com>",
    subject: "Nodemailer is unicode friendly ✔",
    text: "Hii Chutiye!",
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return process.exit(1);
    }

    console.log("Message sent: %s", info.messageId);
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from serverless function!" }),
  };
};
