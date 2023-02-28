const mongoose = require('mongoose');
require('colors');

/*
This is a Node.js module that connects to a MongoDB database using the Mongoose library.
It exports an async function named connectDB() that creates a connection to the specified MongoDB URI.
If the connection is successful, it logs a message indicating that MongoDB is connected, along with the host name.
If the connection fails, it logs an error message and exits the process.
*/
const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    try {
      const conn = await mongoose.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
      console.error(`Error: ${error.message}`.red.bold);
      process.exit();
    }
};

// Export the connectDB async function
module.exports = connectDB;