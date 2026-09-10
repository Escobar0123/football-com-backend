const express=require('express');const router=express.Router();const User=require('../models/User');
router.post('/register',async(req,res)=>{const u=await User.create({...req.body,isAdmin:req.body.email===process.env.ADMIN_EMAIL});res.json(u);});
router.post('/login',async(req,res)=>{const u=await User.findOne({email:req.body.email,password:req.body.password});if(!u)return res.status(400).json({error:'Invalid'});res.json(u);});
router.get('/me/:email',async(req,res)=>{const u=await User.findOne({email:req.params.email});res.json(u);});
module.exports=router;
