const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 20
        },
        lastName: {
            type: String,
            minLength: 3,
            maxLength: 20
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowerCase: true,
            immutable: true
        },
        age: {
            type: Number
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        } ,
        problemSolved: {
            type: [
                {
                    type:Schema.Types.ObjectId ,
                    ref:'problem'
                }
            ],
            unique:true
        },
        password: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);


userSchema.post("findOneAndDelete" , async function (userInfo) {
    if(userInfo){
        await mongoose.model('submission').deleteMany({userId:userInfo._id});
    }
});
const User = mongoose.model("user", userSchema);
module.exports = User;