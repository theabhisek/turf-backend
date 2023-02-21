const app= require("./app");
require('dotenv').config({path:'backend/database/.env'})

const {connectDb} = require("./database/database")

connectDb()

app.listen(process.env.PORT,()=>{
    console.log(`server running on PORT ${process.env.PORT}`)
})
