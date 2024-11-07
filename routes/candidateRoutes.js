const express = require("express"); // require express
const router = express.Router(); // require router
const Candidate = require("../models/candidate"); // require candidate schema
const User = require("../models/user"); // require user schema
const { jwtAuthMiddleware } = require("../jwt"); // require jwt auth middleware

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user.role === "admin";
  } catch (err) {
    return false;
  }
};

// post route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res
        .status(403)
        .json({ err: "Access Denied, user hasn't admin role." });
    }

    const data = req.body; //Assumiong the request body contains the candidate data
    const newCandidate = new Candidate(data); //create a new User document using mongoose model
    const response = await newCandidate.save(); //Save the new user to Database
    console.log("data saves successfully");
    res.status(200).json({ response: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Failed to save user" });
  }
});

router.put("/:candidateID", async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id)) {
      return res
        .status(403)
        .json({ err: "Access Denied, user hasn't admin role." });
    }

    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;

    const response = await Person.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true, // retun the updated candidate
        runValidators: true, // tun mongoose validation
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }

    console.log("Candidate Data updated!");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

router.delete("/:candidateID", async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id)) {
      return res
        .status(403)
        .json({ err: "Access Denied, user hasn't admin role." });
    }

    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }

    console.log("Candidate Deleted");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

// let's start voting
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
  // no admin can vote
  // user can vote only once

  candidateID = req.params.candidateID;
  userID = req.user.id;

  try {
    // Find the candidate document with the specific candidateID
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isVoted) {
      res.status(400).json({ message: "You have already voted" });
    }
    if (user.role == "admin") {
      res.status(403).json({ message: "admin is not allowed" });
    }

    // update the candidate document to record the vote
    candidate.votes.push({ user: userID });
    candidate.voteCount++;
    await candidate.save();

    // update the user document
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Voted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

// vote count
router.get('/vote/count', async (req, res) => {
  try{
    // find all the candidates and sort them by voteCount in descending order
      const candidate = await Candidate.find().sort({voteCount: 'desc'});

      // map the candidates to only return their name and vote count
      const voteRecord = candidate.map((data) => {
        return {
          party: data.party,
          Count: data.voteCount
        }
      })


      return res.status(200).json(voteRecord)

  }catch(err){
    console.log(err);   
    res.status(403).json({ error: "Invalid token" });
  }
})

module.exports = router; //export the router module
