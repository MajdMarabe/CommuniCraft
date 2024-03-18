

const mongoose = require("mongoose");
const joi = require('joi');

// project  Schema
const ProjectSchema = new mongoose.Schema({
title :{
    type: String,
    required:true,
    trim:true,
    minlength:3,
    maxlength:250
},
category :{
    type:String,
    required:true,
    minlength:3,
    trim: true 
},
description:{
    type:String,
    required:true,
    minlength:3,
    trim: true 
},


groupSize:{
    type: String,
    required:true,
    minlength:3,
    trim: true 
},
levels:{
    type: String,
    required:true,
    enum:[ "biggner", "middle", "advanced"] 
},

skill_Name: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Skill'}],
collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
plans1: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Plan'}],

}, {timestamps: true});

//Project  Model 
const Project = mongoose.model("Project",ProjectSchema);

// validate Creat Project method
function validateCreatProject(obj){
    const schema = joi.object({       
        // بحدد الخصائص لكل عنصر        
        title: joi.string().trim().min(3).max(250).required(), // trim :مسح للفراغات باول وآخر السترنج , required : بعطينا ياها المستخدم
        category: joi.string().trim().min(3).required(),
        description : joi.string().trim().min(3).required(),
        groupSize : joi.number().min(3).required(),
        levels: joi.string().valid( "biggner", "middle", "advanced").required(),
        skill_Name : joi.string().required()
      }) ;
    
      return schema.validate(obj); //  req.body باخد البيانات من  , error : اسم الاوبجكت
}


// validate Update Project method
function validateUpdateProject(obj){
    const schema = joi.object({       
        // بحدد الخصائص لكل عنصر        
        title: joi.string().trim().min(3).max(250), // trim :مسح للفراغات باول وآخر السترنج , required : بعطينا ياها المستخدم
        category: joi.string().trim().min(3),
        description : joi.string().trim().min(3),
        groupSize : joi.string().trim().min(3),
        levels: joi.string().valid( "biggner", "middle", "advanced"),
        skill_Name : joi.string()
      }) ;
    
      return schema.validate(obj); //  req.body باخد البيانات من  , error : اسم الاوبجكت
}




module.exports={
    Project,
    validateCreatProject,
    validateUpdateProject
}