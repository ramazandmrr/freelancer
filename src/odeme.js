const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://ramazan:123@cluster0.mhlwggh.mongodb.net/")


.then(()=>{
    console.log('mongoose connected 3');
})
.catch((e)=>{
    console.log('failed');
})

const odeme=new mongoose.Schema({
    odemead:{
        type:String,
        required:true,
       
    },
    odemeadres:{
        type:String,
        required:true,
        
    },
    odemedosya:{
        type:String,
        required:true
    }
})


const Pay=new mongoose.model('Pay',odeme)

module.exports=Pay