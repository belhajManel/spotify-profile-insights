require('dotenv').config()
const express = require("express");
const app = express();
const port = 8888;


app.get("/", (req, res) => {
  res.send("Heelo from get request");
});

app.get("/awesome-generator", (req, res) => {
  const { name, isAwesome } = req.query;
  res.send(`${name} ${JSON.parse(isAwesome) ? "really" : "not"} awesome `);
});

app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});
