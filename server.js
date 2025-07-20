const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

mongoose.connect("your-mongodb-uri-here", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const formSchema = new mongoose.Schema({
  id: String,
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
    const newForm = new Form(req.body);
    await newForm.save();
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit form" });
  }
});

app.get("/admin-data", async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
