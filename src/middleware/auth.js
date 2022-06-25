const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        if(!token){
            throw new Error()
        }
        const decoded=jwt.verify(token,'thisismytoken')
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token=token
        req.auth=user
        next()
    }catch(e){
        res.status(401).send({eeror:'please authenticate'})
    }
}
module.exports=auth