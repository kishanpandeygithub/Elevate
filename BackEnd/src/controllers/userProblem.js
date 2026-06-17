const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility.js")
const Problem = require("../models/problem.js")
const User = require("../models/user.js");
const Submission = require("../models/submission.js");

const createProblem = async (req, res) => {
    

    const { title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases, startCode,
        referenceSolution, problemCreator } = req.body;
    try {
        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);
            //I am creating the batch submition
            
            const submissions = visibleTestCases.map((testcases) => ({
                // source_code
                // language_id
                // stdin
                // expected_output

                source_code: completeCode,
                language_id: languageId,
                stdin: testcases.input,
                expected_output: testcases.output
            }));
            
            // the submit batch find the resopnce in the form of tokens from the judge0
            const submitResult = await submitBatch(submissions);
            // this resultToken contain the all the array of the all the token
             
            const resultToken = submitResult.map((val) => (val.token));
            // this testresult find the status id and the result
            const testResult = await submitToken(resultToken);
            
            //the result is obtained check if the result id is three or not 
            //otherwise it is the wrong responce
            
            for (const test of testResult) {
                if (test.status_id == 4) {
                    return res.status(400).send('Wrong Answer');
                }
                else if (test.status_id == 5) {
                    return res.status(400).send('Time Limit Exceeded ');
                }
                else if (test.status_id == 6) {
                    return res.status(400).send('Compilation Error');
                }
                else if (test.status_id >= 7) {
                   return res.status(400).send('RunTiem Error');
                }
            }
        }

        
        //now we can store it in the db 
        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        });

        return res.status(201).send("Problem Solved successfully");
    }
    catch (err) {
       return res.status(400).send(err.message);
    }
}

const updateProblem = async (req, res) => {
    const { title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases, startCode,
        referenceSolution, problemCreator } = req.body;
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("Missing Id Field");
        }
        const DsaProblem = await Problem.findById(id);
        if (!DsaProblem) {
            return res.status(404).send('Id is not Present');
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);
            //I am creating the batch submition
            const submissions = visibleTestCases.map((testcases) => ({
                // source_code
                // language_id
                // stdin
                // expected_output

                source_code: completeCode,
                language_id: languageId,
                stdin: testcases.input,
                expected_output: testcases.output
            }));
            // the submit batch find the resopnce in the form of tokens from the judge0
            const submitResult = await submitBatch(submissions);
            // this resultToken contain the all the array of the all the token 
            const resultToken = submitResult.map((val) => (val.token));
            // this testresult find the status id and the result
            const testResult = await submitToken(resultToken);
            //the result is obtained check if the result id is three or not 
            //otherwise it is the wrong responce

            console.log("yaha tak ho gaya")
            for (const test of testResult) {
                if (test.status_id == 4) {
                    res.status(400).send('Wrong Answer');
                }
                else if (test.status_id == 5) {
                    res.status(400).send('Time Limit Exceeded ');
                }
                else if (test.status_id == 6) {
                    res.status(400).send('Compilation Error');
                }
                else if (test.status_id >= 7) {
                    res.status(400).send('RunTiem Error');
                }
            }
        }

        const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
        res.status(200).send(newProblem);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Error: " + err.message);
    }
}

const deleteProblem = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("Id is not Present");
        }
        const DsaProblem = await Problem.findById(id);
        if (!DsaProblem) {
            return res.status(404).send("Problem Not Present");
        }
        await Problem.findByIdAndDelete(id);
        res.status(200).send("Problem Deleted Successfully");
    }
    catch (err) {
        res.status(500).send("Error", +err)
    }
}

const getProblemById = async (req, res) => {
    const { id } = req.params;
    try {
        console.log("route hits")
        if (!id) {
            return res.status(400).send("Id is not Present");
        }
        const DsaProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');
        if (!DsaProblem) {
            return res.status(404).send("Problem Not Present");
        }
        res.status(200).send(DsaProblem);
    }
    catch (err) {
        res.status(500).send("Error", +err)
    }
}

const getAllProblem = async (req, res) => {
    try {
        const allDsaProblem = await Problem.find({}).select('_id title difficulty tags');
        if (allDsaProblem.length == 0) {
            return res.status(404).send("Problem Not Present");
        }
        res.status(200).send(allDsaProblem);
    }
    catch (err) {
        res.status(500).send("Error", +err)
    }
}

const solvedAllProblemByUser = async(req , res)=>{
    try{
        const userId = req.result._id;
        const user = await User.findById(userId).populate({
            path:"problemSolved" ,
            select:"_id title difficulty tags"
        });
        res.status(200).send(user.problemSolved);
    }
    catch(err){
        console.log("Error in solvedProblem :"  ,err.message);
        res.status(500).send("Server Error");
    }
}

const submittedProblem = async (req , res)=>{
    try{
        const userId = req.result._id;
        const problemId =req.params.pid;
        const ans = await Submission.find({userId , problemId});
        if(ans.length==0){
            res.status(200).send("No Submission");
        }
        res.status(200).send(ans);
    }
    catch(err){
        res.status(500).send("Internal server Error");
    }
}
module.exports = {submittedProblem ,solvedAllProblemByUser , createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem }; 