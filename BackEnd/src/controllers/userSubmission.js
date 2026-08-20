const Problem = require("../models/problem.js");
const Submission = require("../models/submission.js");
const User = require("../models/user.js");

const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility.js");
const submitCode = async (req, res) => {
    try {
        console.log("Submission API called");
        const userId = req.result._id;
        const problemId = req.params.id;

        const { code, language } = req.body;
        console.log(userId, " ,", problemId, "  , ", code, "  ,", language);
        if (!userId || !code || !language || !problemId) {
            return res.status(400).send("Some Field MIssing");
        }

        //fetch the problem from the databases

        const problem = await Problem.findById(problemId);

        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: 'pending',
            testCasesTotal: problem.hiddenTestCases.length,
        });
        //verify the code with the judge 0
        const languageId = getLanguageById(language);
        const submissions = problem.hiddenTestCases.map((testcases) => ({
            // source_code
            // language_id
            // stdin
            // expected_output

            source_code: code,
            language_id: languageId,
            stdin: testcases.input,
            expected_output: testcases.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((val) => val.token);

        const testResult = await submitToken(resultToken);

        //now we have to update the submit result 
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = '';
        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            } else {
                if (test.status_id == 4) {
                    status = 'error';
                    errorMessage = test.stderr;
                } else {
                    status = 'wrong';
                    errorMessage = test.stderr;
                }
            }
        }
        //store the result in the data base
        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;

        await submittedResult.save();
        //here we insert the problem id in the user shchema problem solved 
        //if it is not present there 
        if (!req.result.problemSolved.includes(problemId)) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }
        res.status(201).send(submittedResult);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Enternal Server error");
    }
}

const runCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;

        const { code, language } = req.body;
        console.log(userId, " ,", problemId, "  , ", code, "  ,", language);
        if (!userId || !code || !language || !problemId) {
            return res.status(400).send("Some Field MIssing");
        }

        //fetch the problem from the databases

        const problem = await Problem.findById(problemId);

        //verify the code with the judge 0
        const languageId = getLanguageById(language);
        const submissions = problem.visibleTestCases.map((testcases) => ({
            // source_code
            // language_id
            // stdin
            // expected_output

            source_code: code,
            language_id: languageId,
            stdin: testcases.input,
            expected_output: testcases.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((val) => val.token);

        const testResult = await submitToken(resultToken);

       
        res.status(201).send(testResult);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Enternal Server error");
    }
}


module.exports = { submitCode , runCode };