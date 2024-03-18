const mongoose = require("mongoose");
const joi = require('joi');

// project  Schema
const UserSchema = new mongoose.Schema({
    username :{
    type: String,
    required:true,
    trim:true,
    minlength:3,
    maxlength:250,
    unique: true
},
email :{
    type:String,
    required:true,
    minlength:3,
    trim: true ,
    maxlength:250,
    unique: true

},
location:{
    type:String,
    required:true,
    minlength:3,
    trim: true 
},


password_hash:{
    type: String,
    required:true,
    minlength:3,
    trim: true 
},

skill_Name: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Skill'}],
tools1: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Tool'}],

}, {timestamps: true});

//Project  Model 
const User = mongoose.model("User",UserSchema);

// validate Creat Project method
function validateCreatUser(obj){
    const schema = joi.object({       
        // بحدد الخصائص لكل عنصر        
        username: joi.string().trim().min(3).max(250).required(), // trim :مسح للفراغات باول وآخر السترنج , required : بعطينا ياها المستخدم
        email: joi.string().trim().min(3).required().email(),
        location : joi.string().trim().min(3).required(),
        skill_Name : joi.string().required(),
        password_hash: joi.string().trim().min(3).required(),
       // is_Admin : joi.bool(),
      }) ;
    
      return schema.validate(obj); //  req.body باخد البيانات من  , error : اسم الاوبجكت
}
function validateUpdateUser(obj){
    const schema = joi.object({       
        // بحدد الخصائص لكل عنصر        
        username: joi.string().trim().min(3).max(250), // trim :مسح للفراغات باول وآخر السترنج , required : بعطينا ياها المستخدم
        email: joi.string().trim().min(3).email(),
        location : joi.string().trim().min(3),
        skill_Name : joi.string(),
        password_hash: joi.string().trim().min(3),
      }) ;
    
      return schema.validate(obj); //  req.body باخد البيانات من  , error : اسم الاوبجكت
}

// validate Update Project method

function validateLoginUser(obj){
    const schema = joi.object({       
        // بحدد الخصائص لكل عنصر        
         // trim :مسح للفراغات باول وآخر السترنج , required : بعطينا ياها المستخدم
        email: joi.string().trim().min(3).required().email(),
        password_hash: joi.string().trim().min(3).required(),
      }) ;
    
      return schema.validate(obj); //  req.body باخد البيانات من  , error : اسم الاوبجكت
}
module.exports={
    User,
    validateCreatUser,
    validateLoginUser,
    validateUpdateUser
}