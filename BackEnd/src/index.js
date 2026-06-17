require('dotenv').config();
const express = require("express");
const app = express();

const User = require("./models/user.js")

const main = require("./config/db.js");
const redisClient = require("./config/redis.js");

const cookieParser = require("cookie-parser")

const authRouter = require("./routes/userAuth.js");
const problemRouter = require("./routes/problemCreator.js")
const submitRouter = require("./routes/submit.js");
const aiRouter = require("./routes/aiChatting.js")

const cors =require('cors');

app.use(cors(
    {
        origin:'http://localhost:5173',
        credentials:true
    }
))

app.use(express.json());
app.use(cookieParser());


app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission" , submitRouter);
app.use("/ai" , aiRouter);

const InitilizeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("The database connected successfully");
        app.listen(process.env.PORT, () => {
            console.log(`The port is listning int the Port no ${process.env.PORT}`)
        })
    }
    catch (err) {
        console.log("DataBase connecction Error", err);
    }
}

InitilizeConnection();


