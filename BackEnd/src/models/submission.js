const mongoose =require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId ,
            ref:'user' ,
            required:true
        } ,
        problemId:{
            type:Schema.Types.ObjectId ,
            ref:'problem' ,
            required:true
        } ,
        code:{
            type:String ,
            required:true ,
        } ,
        language:{
            type:String ,
            required:true ,
            enum:['javascript' , 'python' ,'cpp' ,'c++' , 'java' ,'c' ,'typescript']//expanded langauge support
        } ,
        status:{
            type:String ,
            enum:['pending' ,'accepted' ,'wrong','error'] ,
            default:'pending'
        },
        runtime:{
            type:Number ,//milisecond
            default:0
        } ,
        memory:{
            type:Number ,//kb
            default:0
        },
        errorMessage:{
            type:String,
            default:''
        } , 
        testCasesPassed:{
            type:Number ,
            default:0
        } ,
        testCasesTotal:{
            type:Number ,
            default:0
        }
    } ,{timestamps:true}
);


//here we create the compound index from the userid and problemid
submissionSchema.index({userId:1,problemId:1});

const Submission =mongoose.model('submission' , submissionSchema);
module.exports = Submission;