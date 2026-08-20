const axios = require("axios");

const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "cpp": 54,
        "javascript": 63,
        "java": 62
    }
    return language[lang.toLowerCase()];
}

const submitBatch = async (submissions) => {

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.log("Judge0 Error:");
            console.log(error.response?.data);
            throw error;
        }
    }

    return await fetchData();
}

const waiting = (ms) => {
    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
}
const submitToken = async (resultToken) => {
    const axios = require('axios');

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            fields: '*' ,
           
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.log("Judge0 Error:");
            console.log(error.response?.data);
            throw error;
        }
    }
    while (true) {
        const result = await fetchData();
        const IsResultObtained = result.submissions.every((r) => r.status_id > 2);
        if (IsResultObtained) {
            return result.submissions;
        }
        await waiting(1000);
    }

}

module.exports = { getLanguageById, submitBatch, submitToken };




