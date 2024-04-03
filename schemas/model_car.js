const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/point",)
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const carSchema=new mongoose.Schema({
    car_name:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    imagecar:{
        type:String,
        required:true
    }
})

const carCollection=new mongoose.model('carCollection',carSchema)

module.exports=carCollection