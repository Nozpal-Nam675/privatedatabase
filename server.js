const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const formSchema = new mongoose.Schema({
  id: Number, // Now auto-assigned
  name: String,
  amount: String,
  reason: String,
  repaymentDate: String,
  contact: String,
  bspAccount: String,
  dateSubmitted: String
});

const Form = mongoose.model("Form", formSchema);

app.post("/submit", async (req, res) => {
  try {
    const count = await Form.countDocuments();
    const newEntry = new Form({ ...req.body, id: count + 1 });
    await newEntry.save();
    res.status(200).json({ message: "Data saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.get("/admin-data", async (req, res) => {
  try {
    const entries = await Form.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
