const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://.../")


.then(()=>{
    console.log('mongoose connected 2');
})
.catch((e)=>{
    console.log('failed');
})

const blogpage=new mongoose.Schema({
    ad:{
        type:String,
        required:true,
       
    },
    fiyat:{
        type:String,
        required:true,
        
    },
    aciklama:{
        type:String,
        required:true
    },
    kim:{
        type:String,
        required:true
    }
})


const Blog=new mongoose.model('Blog',blogpage)

module.exports=Blog
