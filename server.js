const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/puzzle", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/minesweeper", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/spaceship", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
