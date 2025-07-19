const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const mongoURI = "mongodb+srv://nozpalnam:m72b0vKsbV4BunxF@cluster0.zhabmcp.mongodb.net/financeDB?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB (no deprecated options)
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
