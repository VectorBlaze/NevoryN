// server.js — NEVORYN local server
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files (index.html, styles.css, script.js) from this folder
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for the root and any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`NEVORYN is running → http://localhost:${PORT}`);
});