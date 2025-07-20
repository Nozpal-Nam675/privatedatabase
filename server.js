const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// ✅ Your MongoDB URI inserted directly
mongoose.connect("mongodb+srv://nozpalnam:<db_password>@cluster0.zhabmcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const formSchema = new mongoose.Schema({
  id: Number, // Auto-generated position
  name: String,
  amount: String,
  reason: String,
  repaymentDate: String,
  contact: String,
  bspAccount: String,
  dateSubmitted: String
});

const Form = mongoose.model("Form", formSchema);

// ✅ Auto-assign ID based on total count
app.post("/submit", async (req, res) => {
  try {
    const count = await Form.countDocuments();
    const newEntry = new Form({ ...req.body, id: count + 1 });
    await newEntry.save();
    res.status(200).json({ message: "Form submitted and saved" });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ error: "Failed to save form data" });
  }
});

// ✅ Serve dashboard data for index.html
app.get("/admin-data", async (req, res) => {
  try {
    const entries = await Form.find();
    res.json(entries);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to retrieve form data" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
