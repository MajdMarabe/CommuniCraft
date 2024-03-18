const mongoose = require("mongoose");
const joi = require('joi');


const skillSchema = new mongoose.Schema({
    skill_Name: {
        type: String,
        required: true,
        
    }
    // Other skill information fields
});
///// skill  Model 
const Skill = mongoose.model("Skill",skillSchema);

function validateCreatSkill(obj) {
    const schema = joi.object({ 
        skill_Name : joi.string().required(),
    });
    return schema.validate(obj); 
}



module.exports={
    Skill,
    validateCreatSkill
}