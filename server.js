const express = require("express"); //require express
const app = express(); // express instance
const db = require("./db"); // db instance
require("dotenv").config(); // require .env

app.use(express.json()); //inbuilt body parser
const PORT = process.env.PORT || 3000; // default port


//Import routes
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

//use the router
app.use("/user",  userRoutes);
app.use("/candidate", candidateRoutes);

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
