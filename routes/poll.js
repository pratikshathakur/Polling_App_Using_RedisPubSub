const express = require('express');
const router=express.Router();
const mongoose = require('mongoose');
const Vote = require('../models/vote')
const redis=require('redis');
const subscriber = redis.createClient();
const publisher = redis.createClient();

subscriber.on('connect',(req,res)=>{
    console.log('Redis connection established')
})

subscriber.subscribe('voteBank');


publisher.on('connect',(req,res)=>{
    console.log('Redis connection established')
})

router.get('/',(req, res)=>{
    Vote.find().then(votes=>res.json({success: true,votes:votes}))
});

router.get('/eventSource',(req, res)=>{
    res.set('content-type', 'text/event-stream');
    res.set('Connection','keep-alive');
    res.set('Cache-Control','no-cache');
    res.set('Access-Control-Allow-Origin','*');
    subscriber.on('message',(channel,votes)=>{
        res.write(`id: 1\ndata: ${votes}\n\n`);
    })
});

router.post('/',(req, res)=>{
    console.log(req.body.os);
    let vote_obj=new Vote({
        os:req.body.os,
        points:1
    })
    vote_obj.save().then((vote)=>{
        const vote_saved=JSON.stringify(vote);
        publisher.publish('voteBank',vote_saved);
        res.json({msg:vote_saved,vote:req.body.os});
    })
    
})

module.exports =router;