const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.resolve(__dirname, "./client/build")));

// app.get("/*", (req, res)=>{
//   res.sendFile(path.join(__dirname, "build", "index.html"))
// })

app.get("/*", (_, res) => {
	res.sendFile(path.resolve("client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
