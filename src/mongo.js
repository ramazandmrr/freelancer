const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://ramazan:123@cluster0.mhlwggh.mongodb.net/")


.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
       
    },
    password:{
        type:String,
        required:true,
        
    },
    tip:{
        type:String,
        required:true
    },
    para:{
        type: Number,
        require:true
    }
})


const LogInCollection=new mongoose.model('LogInCollection',logInSchema)

module.exports=LogInCollection