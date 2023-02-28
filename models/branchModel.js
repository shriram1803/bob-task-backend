const mongoose = require('mongoose');

// Branch Schema to store each row in CSV as a document in Branch collection in MongoDB Atlas
const branchSchema = new mongoose.Schema({
    "ifsc": String,
    "bank_id": String,
    "branch": String,
    "address": String,
    "city": String,
    "district": String,
    "state": String
});

// Create a Mongoose model for the "branch" collection
const Branch = mongoose.model("Branch", branchSchema);

// The above model can be used to interact with the "branch" collection in the connected MongoDB database

// Export the Branch model
module.exports = Branch;