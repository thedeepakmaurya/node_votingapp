const express = require("express"); // require express
const router = express.Router(); // require router
const User = require("./../models/user"); // require user schema
const { jwtAuthMiddleware, generateToken } = require("./../jwt"); // require jwt auth middleware

// post route to add a new user
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; //Assumiong the request body contains the user data
    const newUser = new User(data); //create a new User document using mongoose model
    const response = await newUser.save(); //Save the new user to Database
    console.log("data saves successfully");

    const payload = {
      id: response.id,
    };

    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is: ", token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to save user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body; //Extract username and password from request body
    const user = await User.findOne({
      aadharCardNumber: aadharCardNumber,
    }); //Find the user by username

    //If user does not exist or password does not match, return error
    if (!user || (await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username and password" });
    }

    const payload = {
      id: response.id,
    };

    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to save user" });
  }
});

// profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log("UserData: ", userData);

    const userId = userData.id;
    const user = await User.findById(userId);

    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).JSON({ err: err.message });
  }
});

router.put("/profile.password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.id; //extract id from the token
    const { oldPassword, newPassword } = req.body; //extract old and new password from request body

    const user = await User.findById({ userId }); //Find the user by userId

    //If password does not match, return error
    if (!(await user.comparePassword(oldPassword))) {
      return res.status(401).json({ error: "Invalid username and password" });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save(); //Save the updated user to the database

    console.log("password updated");
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

module.exports = router; //export the router module
