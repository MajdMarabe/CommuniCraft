const express = require("express");
const router = express.Router();
const asyncHandler= require("express-async-handler"); 
const {validateCreatSkill,Skill}= require("../models/Skill");

// post method يعمل : new obj (new book)and save it in DB
router.post("/",asyncHandler(async(req,res) =>{

    // method joi.object  عملت اوبجكت داخل  
    // بدي اعمل validation
console.log(req.body);
    const {error} = validateCreatSkill(req.body);
if(error){
 return res.status(400).json({message: error.details[0].message}); // 400:  المشكلة من الكلينت مش السيرفر
                                                            
       }// اذا كلشي valid حيرجع null  ,ويكمل الكود طبيعي 

       

 const skill = new Skill (
            // client هدول البيانات نحتاجها من 
     {
        skill_Name:req.body.skill_Name


    }  );
    const result = await skill.save();
    res.status(201).json(result); 

   
    
}));
module.exports= router;