const redisClient = require("../config/redis.js");

const User = require("../models/user.js");
const Submission = require("../models/submission.js");

const validate = require("../utils/validator.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
   
    try {
        //validate the data comeing from the req.cody
        validate(req.body);

        const { firstName, emailId, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "user";
        const user = await User.create(req.body);

        const reply = {
            firstName:user.firstName,
            emailId:user.emailId ,
            _id : user._id ,
            role:user.role
        }
        const token = jwt.sign({ _id: user._id, emailId: emailId, role: "user" }, process.env.JWT_KEY, { expiresIn: 3600 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(201).json({
            user:reply ,
            message:"registered Successfully"
        });
    }
    catch(err){
        console.log(err.message);
        res.status(400).json({
            message: err.message
        });
    }
}

const login = async (req, res) => {
    try {
        
        const { emailId, password } = req.body;
        if (!emailId) {
            throw new Error("Invalid credintial");
        }
        if (!password) {
            throw new Error("Invalid credintial");
        }
        const user = await User.findOne({ emailId });
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Invalid Credintial");
        }
        const reply = {
            firstName:user.firstName,
            emailId:user.emailId ,
            _id : user._id ,
            role:user.role
        }
        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: 3600 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(201).json({
            user:reply ,
            message:"Login Successfully"
        });
    }
    catch(err){
        console.log(err.message);
        res.status(400).json({
            message: err.message
        });
    }
}

const logout = async (req, res) => {
    try {
        //validate the taken
        const { token } = req.cookies;
        //Add the token to the redis blocklist section 
        const payload = jwt.decode(token);
        await redisClient.set(`token${token}`, "Blocked");
        await redisClient.expireAt(`token${token}`, payload.exp);
        // cookies ko clear kar dena 
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.send("Logout Successfull");
    }
    catch (err) {
        res.status(503).send("Error :" + err.message);
    }
}

const adminRegister = async (req, res) => {
    try {
        //validate the data comeing from the req.cody
        validate(req.body);

        const { firstName, emailId, password} = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        const user = await User.create(req.body);

        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: 3600 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        
        res.status(201).send("User Created Successfully");
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send(err.message);
    }
}

const deleteProfile = async(req , res)=>{
    try{
        const userId = req.result._id;

        // delete the profile 
        await User.findByIdAndDelete(userId);
        //delete all the submission 
        //await (Submission.deleteMany({userId}))

        res.status(200).send("Deleted Successfully");
    }
    catch(err){
        res.status(500).send("Server Error");
    }
}
module.exports = { login, register, logout  ,adminRegister ,deleteProfile};
