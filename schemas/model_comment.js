const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/point",)
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const commentSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    MarkerId:{
        type:String,
        required:true
    },
    timestamp:{
        type :String
    },
    username:{
        type :String,
        require:true
    }
})

const commentCollection=new mongoose.model('commentCollection',commentSchema)

module.exports=commentCollection