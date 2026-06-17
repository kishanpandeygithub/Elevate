const validator = require("validator");
const validate = (data) => {
    console.log("validation start");
    const mandatoryField = ["firstName", "emailId", "password"];
    const isAllow = mandatoryField.every((val) => { return Object.keys(data).includes(val) });

    if (!isAllow) {
        throw new Error("Some Field missing From Data");
    }
   
    if (!validator.isEmail(data.emailId)) {
        throw new Error("Wrong EmailId");
    }
    if (!validator.isStrongPassword(data.password)) {
        throw new Error("Week Password");
    };
    
}
module.exports = validate;