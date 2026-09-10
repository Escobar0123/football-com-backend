const mongoose=require('mongoose');
const s=new mongoose.Schema({roundId:{type:String,unique:true},crashPoint:Number,status:{type:String,enum:['betting','flying','crashed'],default:'betting'},bets:[{userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},amount:Number,cashoutAt:Number,win:Number,status:String}],createdAt:{type:Date,default:Date.now},startedAt:Date,crashedAt:Date});
module.exports=mongoose.model('GameRound',s);
