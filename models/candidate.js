const mongoose = require("mongoose"); // require mongoose

// define schema object
const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        party: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        votes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                votedAt: {
                    type: Date,
                    default: Date.now,
                }
            }
        ],
        voteCount: {
            type: Number,
            default: 0,
        }
    }
);

const Candidate = mongoose.model("Candidate", candidateSchema); // mongoose.model
module.exports = Candidate; // export model
