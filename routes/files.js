const router=require('express').Router();
const multer=require('multer');
const File=require('../models/file.js')
const path = require('path');
const {v4:uuid4} = require('uuid');
let storage=multer.diskStorage({
    destination: (req,file,cb)=>cb(null,'uploads/'),
    filename: (req,file,cb)=>{
    const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
    
    cb(null,uniqueName); 
 
    }
})

let upload=multer({
storage,
limit:{filesize: 1000000 * 100},
}).single('myfile');


router.post('/',(req,res)=>{
    console.log('req recived');
// store in uploads
upload(req,res,async(error)=>{
    if(!req.file){
        return res.json({error:"All fields are required"});
        }
    if(error)
    { 
        return res.status(500).send({error:error,message})
    }
// store in DB

const file=new File({
    filename: req.file.filename,
    uuid: uuid4(),
    path: req.file.path,
    size: req.file.size
})

const response=await file.save();
return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
})




// response link to download file

});

router.post('/send',async (req,res)=>{
   const {uuid,emailTo,emailFrom} =req.body; 

   if(!uuid||!emailTo||!emailFrom)
   {
    return res.status(422).send({error:'All fields are required'});
   }

   const file=await File.findOne({uuid: uuid})

   file.sender=emailFrom;
   file.receiver=emailTo; 
   const response=await file.save();

   const sendMail = require('../services/emailService');
sendMail({
    from: emailFrom,
    to: emailTo,
    subject: 'inShare file sharing',
    text:`${emailFrom} shared file with you.`,
    html: require('../services/emailTemplate')({
        emailFrom: emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size:parseInt(file.size/1000)+'KB',
        expires:'24 hours'
    })
})
})


module.exports=router;