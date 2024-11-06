const jwt = require("jsonwebtoken"); // require json webtoken

//create middle
const jwtAuthMiddleware = (req, res, next) => {
  //check if request headers has authorization
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token not found" });

  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    rq.user = decoded;
    next(); // if token is valid, proceed to next middleware or route
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: "Unauthorized" });
  }
};

//function to generate token
const generateToken = (userData) => {
  //generate a new JWT token using user data
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 30000 });
};

module.exports = { jwtAuthMiddleware, generateToken }; // export jwt auth middleware
