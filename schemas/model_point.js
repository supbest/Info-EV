const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/point",)
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const pointSchema=new mongoose.Schema({
    pointName:{
        type:String,
        required:true
    },
    latitude:{
        type: Number,
        required:true
    },
    longitude:{
        type: Number,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    spec:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    }
})

const pointCollection=new mongoose.model('pointCollection',pointSchema)

module.exports=pointCollection