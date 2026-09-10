const mongoose=require('mongoose');
const s=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},type:{type:String,enum:['deposit','withdraw','bet','win','bonus']},amount:Number,reference:String,paystackRef:String,status:{type:String,enum:['pending','success','failed'],default:'pending'},gameRound:String,createdAt:{type:Date,default:Date.now}});
module.exports=mongoose.model('Transaction',s);
