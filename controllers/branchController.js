const Branch = require('../models/branchModel.js');
const asyncHandler = require('express-async-handler');
const csv = require('csv-parser');
const fs = require('fs');

//@description     Insert data from CSV into MongoDB Atlas
//@route           POST /api/
const insertData = asyncHandler(async (req, res) => {

  // This function uses async/await to handle asynchronous database operations
  // It reads a CSV file, creates new Branch objects and saves them to the database using Mongoose's save() method
  // Once all the data has been saved, it sends a response back to the client to indicate successful completion
    Branch.collection.drop(); // Drop the collection before inserting new data

    let counter = 1; // Counter variable to keep track of the number of data being inserted

    // Read the CSV file and pipe it to the CSV parser
    fs.createReadStream('../data/bank_branches.csv')
        .pipe(csv())
        .on('data', (row) => {

        // Create a new Branch object and populate it with data from the CSV row
        const newBranch = new Branch({
            "ifsc": row.ifsc,
            "bank_id": row.bank_id,
            "branch": row.branch,
            "address": row.address,
            "city": row.city,
            "district": row.district,
            "state": row.state
        });

        // Save the new Branch object to the database
        newBranch.save((err) => {
            if (err) {
            console.error(err);
            } else {
            console.log(counter + ' - Data saved successfully!');
            counter += 1;
            }
        });
        })
        .on('end', () => {
        console.log('CSV file successfully processed');
        res.send('CSV file successfully imported into database');
        });

});


//@description     Case 1: Search API to return possible matches across all columns and all rows, ordered by IFSC code (ascending order) with limit and offset.
//@route           POST /api/search
//@params          q=<A city name>, limit=<no of results to generate>, offset=<no of potential results to skip>
//Example URL      /api/search?q=Mumbai&limit=2&offset=1
const getSearch = asyncHandler(async (req, res) => {

    // Get the search query parameters from the request URL
    const { q, limit, offset } = req.query;
    
    try {
      const branches = await Branch.find({
        // Use $or operator to match the search for 'q' in multiple fields
        $or: [
          { branch: { $regex: new RegExp(q, 'i') } },
          { address: { $regex: new RegExp(q, 'i') } },
          { city: { $regex: new RegExp(q, 'i') } },
          { district: { $regex: new RegExp(q, 'i') } },
          { state: { $regex: new RegExp(q, 'i') } },
        ],
      })
      // Sort the results in ascending order based on the IFSC code
      .sort({ ifsc: 'asc' }) 
      // Limit the number of results to be returned based on the limit parameter
      .limit(Number(limit)) 
      // Skip the initial results based on the offset parameter
      .skip(Number(offset)) 
      // Select all fields except _id and __v for the returned documents
      .select('-_id -__v'); 
      
      res.json({ branches }); // Send the JSON response with the matched branches
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});


//@description     Case 2: Branch API to return possible matches based on the branch name ordered by IFSC code (descending order) with limit and offset
//@route           GET /api/branch
//@params          q=<A city name>, limit=<no of results to generate>, offset=<no of potential results to skip>
//Example URL:    /api/branch?q=LONI&limit=1&offset=1
const getBranch = asyncHandler(async (req, res) => {

  // Extracting the query parameters from the request
    const { q, limit, offset } = req.query;
  
    try {
      // Finding branches that match the given branch name (case-insensitive)
      const branches = await Branch.find({ branch: q.toUpperCase() })
        // Sorting the branches in descending order by IFSC code
        .sort({ ifsc: 'desc' })
        // Limiting the number of branches returned based on the 'limit' query parameter
        .limit(Number(limit))
        // Skipping the first 'offset' number of branches
        .skip(Number(offset))
        // Excluding the '_id' and '__v' fields from the result
        .select('-_id -__v');
      
      // Sending the branches in the response as JSON
      res.json({ branches });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the following functions
module.exports = { insertData, getSearch, getBranch };