const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files like index.html

// MongoDB Connection URI
const mongoURI = "mongodb+srv://nozpalnam:m72b0vKsbV4BunxF@cluster0.zhabmcp.mongodb.net/financeDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define Mongoose schema and model
const loanRequestSchema = new mongoose.Schema({
  id: String,
  name: String,
  amount: Number,
  reason: String,
  repaymentDate: String,
  contact: String,
  bspAccount: String,
  dateSubmitted: String
});

const LoanRequest = mongoose.model("LoanRequest", loanRequestSchema);

// Route to serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET route to fetch all submissions for the admin dashboard
app.get("/admin-data", async (req, res) => {
  try {
    const forms = await LoanRequest.find().sort({ dateSubmitted: -1 });
    res.json(forms);
  } catch (err) {
    console.error("❌ Error retrieving admin data:", err);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// POST endpoint to receive loan request data
app.post("/submit", async (req, res) => {
  try {
    const loanData = new LoanRequest(req.body);
    await loanData.save();
    res.json({ message: "Data stored successfully!" });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ message: "Server error, data not saved." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
