const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const USERS_FILE = "users.json";

app.use(cors());
app.use(bodyParser.json());

// 📌 Read Users from JSON File
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return data.length ? JSON.parse(data) : [];
};

// 📌 Save Users to JSON File
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// 📌 Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// 📌 Signup API
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  let users = readUsers();

  if (users.some((u) => u.username === username)) {
    return res
      .status(400)
      .json({ success: false, message: "Username already exists" });
  }

  const newUser = { username, email, password };
  users.push(newUser);
  saveUsers(users);
  res.json({ success: true, user: newUser });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
