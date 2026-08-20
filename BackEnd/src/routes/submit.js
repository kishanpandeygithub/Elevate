const express = require("express");
const submitRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware.js");
const {submitCode ,runCode} = require("../controllers/userSubmission.js")
const submitCodeRateLimitor = require("../middleware/rateLimiter.js");

submitRouter.post("/submit/:id" ,userMiddleware ,submitCodeRateLimitor , submitCode);
submitRouter.post("/run/:id" ,userMiddleware ,submitCodeRateLimitor, runCode);

module.exports = submitRouter;