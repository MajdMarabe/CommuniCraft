const mongoose = require("mongoose");
const joi = require('joi');

const toolSchema = new mongoose.Schema({
    tool_Name: {
        type: String,
        required: true,
        unique : true
        
    },
    description :{
        type: String,
        required: true,
    }
});

const Tool = mongoose.model("Tool",toolSchema);

function validateCreatTool(obj) {
    const schema = joi.object({ 
        tool_Name : joi.string().required(),
        description : joi.string().required(),
    });
    return schema.validate(obj); 
}

// validate Update Project method
function validateUpdateTool(obj){
    const schema = joi.object({       
        // بحدد الخصائص لكل عنصر        
        tool_Name : joi.string(),
        description : joi.string()
        
      }) ;
    
      return schema.validate(obj); //  req.body باخد البيانات من  , error : اسم الاوبجكت
}




module.exports={
    Tool,
    validateCreatTool,
    validateUpdateTool
}