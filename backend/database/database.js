const mongoose=require('mongoose')
mongoose.set('strictQuery', false);
exports.connectDb= function (){
 mongoose.connect(process.env.MONGO_URL)
    .then((con)=>{console.log(`Database connected:${process.env.MONGO_URL}`)})
    .catch((err)=>{console.log(err)})
}