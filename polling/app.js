const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const MONGODB_URI=process.env.MONGODB_URI || "mongodb://localhost:27017/pollingApp";

mongoose.connect(MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},(req,res)=>{
    console.log('Mongodb Connected..!');
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
const poll=require('./routes/poll');
app.use('/poll',poll);




const PORT=8080;
app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`);
})