const mongoose = require("mongoose"); // require mongoose
const bcrypt = require("bcrypt");

// define schema object
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  aadharCardNumber: {
    type: Number,
    required: true,
    unique: true, // ensures unique aadhar card number
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["voter", "admin"], // optional role
    default: "voter", // default role
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  // Hash the password only if it has been modified or new
  if (!user.isModified("password")) return next();

  try {
    // hash password generation
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashPassword = await bcrypt.hash(user.password, salt);

    // override the plain password with the hashed one
    user.password = hashPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema); // mongoose.model
module.exports = User; // export model
