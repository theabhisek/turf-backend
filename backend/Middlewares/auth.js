const allUser=require('../Models/allUserModels')
const jwt=require('./jwt')

exports.isAuthenticated =async(req,res,next)=>{
    try{ 
        console.log(req.body)
        const decoded = await jwt.verify(req,res);
        if(!decoded){
         return res.status(401).json({
            message:"Please login first"
        });

    }
    req.token=await allUser.findById(decoded.id)
    next();
}
catch(error){
    res.status(500).json({
        success:false,
        message:error.message

    })
}
}