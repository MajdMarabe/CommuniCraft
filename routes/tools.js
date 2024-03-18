const express = require("express");
const router = express.Router();
const asyncHandler= require("express-async-handler"); 
const {validateCreatProject,validateUpdateProject,Project}= require("../models/Project");
const {validateCreatSkill,Skill}= require("../models/Skill");
const {validateCreatUser,validateLoginUser,validateUpdateUser,User}= require("../models/User");
const {validateCreatPlan,Plan}= require("../models/Plan");
const {validateCreatTool,validateUpdateTool,Tool}= require("../models/Tool");


router.post("/",asyncHandler(async(req,res) =>{

    // method joi.object  عملت اوبجكت داخل  
    // بدي اعمل validation
console.log(req.body);
    const {error} = validateCreatTool(req.body);
if(error){
 return res.status(400).json({message: error.details[0].message}); // 400:  المشكلة من الكلينت مش السيرفر
                                                            
       }// اذا كلشي valid حيرجع null  ,ويكمل الكود طبيعي 

       

 const tool = new Tool (
            // client هدول البيانات نحتاجها من 
     {
        tool_Name:req.body.tool_Name,
        description : req.body.description

    }  );
    const result = await tool.save();
    res.status(201).json(result); 

   
    
}));

/**
 * @desc Get all tools
 * @route /api/projects/:id
 * @method Get
 * @access public
 */


router.get("/",asyncHandler(async(req,res)=>{
    const tools = await Tool.find().populate(); 
    res.status(200).json(tools);
}));


/**
 * @desc Get  project by id
 * @route /api/projects/:id
 * @method Get
 * @access public
 */

router.get("/:id",asyncHandler(async(req,res)=>{ //  : id   id daynamic

    const tool = await Tool.findById(req.params.id).populate(); //  parseInt حول النص الى عدد  يلي هو الايدي يلي بياخدها من الريكويست
    if (tool) {
        res.status(200).json(tool); // اذا الكتاب موجود في الاري , 200: نجح  , ويرسله الكتاب 
    }
    else{
        res.status(404).json({ message:"tool not found"});
    }
})) ;



/**
 * @desc update tool
 * @route /api/projects/:id
 * @method PUT
 * @access public
 * */
 
// PUT:(id بيعمل ابديت على اوبجكت معين (نحتاج  
router.put("/:id",asyncHandler(async(req,res)=>{ 
    // لازم نعمل فاليديشن على البيانات رح تيجي من الكلينت
    const {error}= validateUpdateTool(req.body);

    if(error){
        return res.status(400).json({ message: error.details[0].message}); // برجع المسج يلي رح ياخدها من الايرور

    }
    
    const updatedTool = await Tool.findByIdAndUpdate(req.params.id ,{
        $set: {
            
            tool_Name:req.body.tool_Name,
            description : req.body.description
        }
    } , {new: true }); //عشان يعطي للكلينت الابديت بوك
 
    res.status(200).json(updatedTool);
})); 


/**
 * @desc Delete a project
 * @route /api/project/:id
 * @method DELETE
 * @access public
 */
// delete:(id بيعمل حذف على اوبجكت المطلوب حذفه (نحتاج  
router.delete("/:id",asyncHandler(async(req,res)=>{ 
   
   
    // 
    const tool= await Tool.findByIdAndDelete(req.params.id) ;
    
    if(tool){
    res.status(200).json({ message:"tool has been deleted"});
}
else{
    res.status(404).json({ message:"tool not found"});
}
}));


















module.exports= router;