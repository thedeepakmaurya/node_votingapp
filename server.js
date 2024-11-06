const express = require("express"); //require express
const app = express(); // express instance
//require("dotenv").config(); // require .env

app.use(express.json()); //inbuilt body parser
const PORT = process.env.PORT || 3000; // default port

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
