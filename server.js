const express =require('express');
const app=express();
const path=require('path')
const PORT=process.env.PORT || 5000;

app.set('views',path.join(__dirname,'/views'));
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(express.json()); 
const connectDB=require('./config/db');
connectDB();

app.use('/api/files/',require('./routes/files'));
app.use('/files',require('./routes/show.js'));
app.use('/files/download',require('./routes/download'));

app.listen(PORT,()=>{
    console.log("listning on "+PORT);    
});
