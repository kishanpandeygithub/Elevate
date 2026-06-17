const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");
const userMiddleware = async (req , res , next)=>{
    try{
        console.log("validation Start");
        const {token} = req.cookies;
        console.log("Cookies:", req.cookies);
        console.log("Token:", req.cookies.token);
        if(!token){
            throw new Error("Token is not Present");
        }
        const payload = jwt.verify(token ,process.env.JWT_KEY);
        const {_id} = payload;
        if(!_id){
            throw new Error("Invalid token");
        }
        const result = await User.findById(_id);
        if(!result){
            throw new Error("User Dose Not Exist");
        }

        //check is the user present in the blocklist of the redis 
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if(IsBlocked){
            throw new Error("Invalid token");
        }
        console.log("validation end");
        req.result = result;
        next();
    }
    catch(err){
        res.status(401).send("Error: "+ err.message);
    }
}

module.exports = userMiddleware;
