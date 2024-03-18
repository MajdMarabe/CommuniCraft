const express = require("express");
const router = express.Router();
const asyncHandler= require("express-async-handler"); 
const {validateCreatProject,validateUpdateProject,Project}= require("../models/Project");
const {validateCreatSkill,Skill}= require("../models/Skill");
const {validateCreatUser,validateLoginUser,validateUpdateUser,User}= require("../models/User");
const {validateCreatPlan,validateUpdatePlan,Plan}= require("../models/Plan");

router.post("/",asyncHandler(async(req,res) =>{

    // method joi.object  عملت اوبجكت داخل  
    // بدي اعمل validation
console.log(req.body);
    const {error} = validateCreatPlan(req.body);
if(error){
 return res.status(400).json({message: error.details[0].message}); // 400:  المشكلة من الكلينت مش السيرفر
                                                            
       }// اذا كلشي valid حيرجع null  ,ويكمل الكود طبيعي 

       

 const plan = new Plan (
            // client هدول البيانات نحتاجها من 
     {
        plan_Name:req.body.plan_Name,
        description : req.body.description

    }  );
    const result = await plan.save();
    res.status(201).json(result); 

   
    
}));



/**
 * @desc Get all plans
 * @route /api/plans/:id
 * @method Get
 * @access public
 */


router.get("/",asyncHandler(async(req,res)=>{
    const plan = await Plan.find().populate(); 
    res.status(200).json(plan);
}));


/**
 * @desc Get  plan by id
 * @route /api/plans/:id
 * @method Get
 * @access public
 */

router.get("/:id",asyncHandler(async(req,res)=>{ //  : id   id daynamic

    const plan = await Plan.findById(req.params.id).populate(); //  parseInt حول النص الى عدد  يلي هو الايدي يلي بياخدها من الريكويست
    if (plan) {
        res.status(200).json(plan); // اذا الكتاب موجود في الاري , 200: نجح  , ويرسله الكتاب 
    }
    else{
        res.status(404).json({ message:"plan not found"});
    }
})) ;



/**
 * @desc update plan
 * @route /api/plans/:id
 * @method PUT
 * @access public
 * */
 
// PUT:(id بيعمل ابديت على اوبجكت معين (نحتاج  
router.put("/:id",asyncHandler(async(req,res)=>{ 
    // لازم نعمل فاليديشن على البيانات رح تيجي من الكلينت
    const {error}= validateUpdatePlan(req.body);

    if(error){
        return res.status(400).json({ message: error.details[0].message}); // برجع المسج يلي رح ياخدها من الايرور

    }
    
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id ,{
        $set: {
            
            plan_Name:req.body.plan_Name,
            description : req.body.description
        }
    } , {new: true }); //عشان يعطي للكلينت الابديت بوك
 
    res.status(200).json(updatedPlan);
})); 


/**
 * @desc Delete a plan
 * @route /api/plans/:id
 * @method DELETE
 * @access public
 */
// delete:(id بيعمل حذف على اوبجكت المطلوب حذفه (نحتاج  
router.delete("/:id",asyncHandler(async(req,res)=>{ 
   
   
    // 
    const plan= await Plan.findByIdAndDelete(req.params.id) ;
    
    if(plan){
    res.status(200).json({ message:"plan has been deleted"});
}
else{
    res.status(404).json({ message:"plan not found"});
}
}));
















module.exports= router;