const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, "./client/build")));

// app.get("/*", (req, res)=>{
//   res.sendFile(path.join(__dirname, "build", "index.html"))
// })

// app.get("/*", (req, res)=>{
//   res.sendFile(path.resolve('client', "build", "index.html"))
// })