const mongoose = require("mongoose");
const joi = require('joi');

const planSchema = new mongoose.Schema({
    plan_Name: {
        type: String,
        required: true,
        unique : true
        
    },
    description :{
        type: String,
        required: true,
    }
});

const Plan = mongoose.model("Plan",planSchema);

function validateCreatPlan(obj) {
    const schema = joi.object({ 
        plan_Name : joi.string().required(),
        description : joi.string().required(),
    });
    return schema.validate(obj); 
}

function validateUpdatePlan(obj){
    const schema = joi.object({       
            
        plan_Name : joi.string(),
        description : joi.string()
        
      }) ;
    
      return schema.validate(obj); //  req.body باخد البيانات من  , error : اسم الاوبجكت
}




module.exports={
    Plan,
    validateCreatPlan,
    validateUpdatePlan
}


