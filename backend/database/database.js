const mongoose=require('mongoose')
const cloudinary = require("cloudinary")
mongoose.set('strictQuery', false);

// Set up the options for the MongoDB connection
const options = {
  user: process.env.username,
  pass: process.env.password,
  dbName: process.env.dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true
};
exports.connectDb= function (){
  mongoose.connect(process.env.url, options)
  .then(() => {
    console.log(`Connected to database ${process.env.url}`);
  })
  .catch((err) => {
    console.log(err.message);
  });
 }

// Connect to the MongoDB database


cloudinary.config({
    cloud_name: 'djgdlchfe',
    api_key: '465259525437394',
    api_secret: 'QjoIBhg-fzTHFU7WcLLWIRHYj9o'
  });