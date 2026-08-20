// here we implemet the ratelimitor 
const redisClient = require("../config/redis.js");

const submitCodeRateLimitor = async (req  ,res , next)=>{
    const userId =req.result._id;
    const redisKey= `submit_cooldown:${userId}`;
    try{
        const exists = await redisClient.exists(redisKey);
        if(exists){
            return res.status(429).json({
                error:'Please wait for 10 second Before Submitting again'
            });
        }
        //set the cooldown period
        await redisClient.set(redisKey , 'coo;down_activate' ,{
            EX:3,
            NX:true
        });
        next();
    }
    catch(err){
        console.error('Ratelimiter errror' , err);
        res.status(500).send("Internal server Error");
    }
}

module.exports = submitCodeRateLimitor;