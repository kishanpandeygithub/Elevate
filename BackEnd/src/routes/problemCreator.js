const express = require("express");

const userMiddleware = require("../middleware/userMiddleware.js")
const adminMiddleware = require("../middleware/adminMiddleware.js");
const {submittedProblem ,solvedAllProblemByUser ,createProblem , updateProblem ,deleteProblem ,getProblemById ,getAllProblem}= require("../controllers/userProblem.js")

const problemRouter = express.Router();
//create :: this three need the admin addess
problemRouter.post("/create" ,adminMiddleware , createProblem);
problemRouter.patch("/update/:id" , adminMiddleware ,updateProblem);
problemRouter.delete("/delete/:id" , adminMiddleware , deleteProblem);


problemRouter.get("/problemById/:id" , userMiddleware, getProblemById);
problemRouter.get("/getAllProblem" , userMiddleware ,getAllProblem);


// this route gives the all the problem list solved by the user
problemRouter.get("/problemSolvedByUser"  ,userMiddleware,solvedAllProblemByUser);

// this route gives the all the submission(wrong or write) on the single problem
problemRouter.get("/submittedProblem/:pid" , userMiddleware ,submittedProblem);
// //fetch 
//update
//delete

module.exports =problemRouter;