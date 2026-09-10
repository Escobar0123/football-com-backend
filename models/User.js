const mongoose=require('mongoose');
const s=new mongoose.Schema({username:String,email:{type:String,unique:true},password:String,balance:{type:Number,default:0},totalDeposits:{type:Number,default:0},totalWithdrawals:{type:Number,default:0},totalBets:{type:Number,default:0},isAdmin:Boolean,createdAt:{type:Date,default:Date.now}});
module.exports=mongoose.model('User',s);
