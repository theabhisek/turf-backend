const mongoose=require('mongoose')
const cloudinary = require("cloudinary")
mongoose.set('strictQuery', false);
exports.connectDb= function (){
 mongoose.connect(process.env.MONGO_URL)
    .then((con)=>{console.log(`Database connected:${process.env.MONGO_URL}`)})
    .catch((err)=>{console.log(err)})
}

cloudinary.config({
    cloud_name: 'djgdlchfe',
    api_key: '465259525437394',
    api_secret: 'QjoIBhg-fzTHFU7WcLLWIRHYj9o'
  });