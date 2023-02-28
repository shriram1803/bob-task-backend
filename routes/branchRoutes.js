const express = require('express');
const { insertData, getSearch, getBranch } = require('../controllers/branchController.js');

// Define a router for the application
const router = express.Router();

// Define the API endpoints and the corresponding HTTP methods
router.route("/").post(insertData);    // To insert the data from CSV file to database
router.route("/search").get(getSearch);   // To search the database with a query string
router.route("/branch").get(getBranch);   // To retrieve the details of a specific branch

// Export the router
module.exports = router;