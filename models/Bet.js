const mongoose=require('mongoose');
const s=new mongoose.Schema({email:String,game:String,stake:Number,multiplier:Number,crashPoint:Number,cashoutAt:Number,status:String,profit:Number,createdAt:{type:Date,default:Date.now}});
module.exports=mongoose.model('Bet',s);
