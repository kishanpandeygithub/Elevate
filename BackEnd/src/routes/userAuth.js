const express = require("express");

const userMiddleware = require("../middleware/userMiddleware.js")
const adminMiddleware = require("../middleware/adminMiddleware.js")

const authRouter = express.Router();

const {login ,register ,logout ,adminRegister ,deleteProfile} = require("../controllers/userAuthent.js");
//register
authRouter.post("/register" , register);
//login
authRouter.post("/login",login );
//logout
authRouter.post("/logout" , userMiddleware ,logout);
//delete the profile of the user from the everywhere
authRouter.delete("/delete" , userMiddleware ,deleteProfile);
//this is the validator for the fronted side for the fast login
authRouter.get("/check" , userMiddleware , (req ,res)=>{
    const reply = {
        firstName:req.result.firstName,
        emailId:req.result.emailId ,
        _id : req.result._id ,
        role:req.result.role
    }
    res.status(201).json({
        user:reply ,
        message:"registered Successfully"
    })
});
//this is the routing for the admine
authRouter.post("/admin/register" , adminMiddleware  , adminRegister )

//getprofile
// authRouter.get("/getProfile" , getProfile);
module.exports = authRouter;