const express = require("express");
const router = express.Router();
const asyncHandler= require("express-async-handler"); 
const {validateCreatProject,validateUpdateProject,Project}= require("../models/Project");
const {validateCreatSkill,Skill}= require("../models/Skill");
const {validateCreatUser,validateLoginUser,validateUpdateUser,User}= require("../models/User");
const {validateCreatPlan,Plan}= require("../models/Plan");
/**
 * @desc Get all projects
 * @route /api/projects
 * @method Get
 * @access public
 */

router.get("/",asyncHandler(async(req,res)=>{
    const projects = await Project.find().populate(); 
    res.status(200).json(projects);
}));


/**
 * @desc Get  project by id
 * @route /api/projects/:id
 * @method Get
 * @access public
 */

router.get("/:id",asyncHandler(async(req,res)=>{ //  : id   id daynamic

    const project = await Project.findById(req.params.id).populate(); //  parseInt حول النص الى عدد  يلي هو الايدي يلي بياخدها من الريكويست
    if (project) {
        res.status(200).json(project); // اذا الكتاب موجود في الاري , 200: نجح  , ويرسله الكتاب 
    }
    else{
        res.status(404).json({ message:"project not found"});
    }
})) ;

    /**
 * @desc  Creat new project
 * @route /api/project
 * @method Post
 * @access public
 */

// post method يعمل : new obj (new book)and save it in DB

router.post("/",asyncHandler(async(req,res) =>{

       // method joi.object  عملت اوبجكت داخل  
       // بدي اعمل validation
  console.log(req.body);
       const {error} = validateCreatProject(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message}); // 400:  المشكلة من الكلينت مش السيرفر
                                                               
          }// اذا كلشي valid حيرجع null  ,ويكمل الكود طبيعي 
// Check if the skill exists
    let skill = await Skill.findOne({ skill_Name: req.body.skill_Name });
    if (!skill) {
    return res.status(400).json({ message: "Skill not found" });
    }
   // data come from req
    const project = new Project (
               // client هدول البيانات نحتاجها من 
        {
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            groupSize: req.body.groupSize,
            levels: req.body.levels, 
            skill_Name: [skill._id], 
       }  )
          const result = await  project.save(); // بضيف ال obj in DB
           res.status(201).json(result); 
}));




/**
 * @desc update a project 
 * @route /api/projects/:id
 * @method PUT
 * @access public
 * */
 
// PUT:(id بيعمل ابديت على اوبجكت معين (نحتاج  
router.put("/:id",asyncHandler(async(req,res)=>{ 
    // لازم نعمل فاليديشن على البيانات رح تيجي من الكلينت
    const {error}= validateUpdateProject(req.body);

    if(error){
        return res.status(400).json({ message: error.details[0].message}); // برجع المسج يلي رح ياخدها من الايرور

    }
    
    const updatedProject = await Project.findByIdAndUpdate(req.params.id ,{
        $set: {
            
            title:req.body.title,
            category:req.body.category,
            description:req.body.description,
            groupSize:req.body.groupSize,
            levels:req.body.level,
            skill_Name : req.body.skill_Name 
        }
    } , {new: true }); //عشان يعطي للكلينت الابديت بوك
 
    res.status(200).json(updatedProject);
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
    const project= await Project.findByIdAndDelete(req.params.id) ;
    
    if(project){
    res.status(200).json({ message:"project has been deleted"});
}
else{
    res.status(404).json({ message:"project not found"});
}
}));


///// skill match

router.get("/match-projects/:skill_Name", asyncHandler(async(req,res) => {
    const { skill_Name } = req.params;
    const projects = await Project.find({ skill_Name: skill_Name });
    if (projects && projects.length > 0) {
        res.status(200).json(projects);
    } else {
        res.status(404).json({ message:"Project not found with this skill" });
    }
}));


/**
 * @desc add user to a project
 * @route /api/project/:id
 * @method POST
 * @access public
 */
////////////////////////////// adding user to the project /////////////

router.post('/:projectId/collaborators', async (req, res) => {
    const { projectId } = req.params;
    const { email } = req.body;
    try {
        // Find the user based on the provided email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Add the user's ID as a collaborator to the project
        const project = await Project.findByIdAndUpdate(projectId, { $push: { collaborators: user._id } }, { new: true });
        res.json(project);
    } catch (error) {
        console.error('Error adding collaborator:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


///////////////// Adding plans to the project 
router.post('/:projectId/plans1', async (req, res) => {
    const { projectId } = req.params;
    const { plan_Name } = req.body;
    try {
        // Find the user based on the provided email
        const plan = await Plan.findOne({ plan_Name });
        if (!plan) {
            return res.status(404).json({ error: 'plan not found' });
        }
        // Add the user's ID as a collaborator to the project
        const project = await Project.findByIdAndUpdate(projectId, { $push: { plans1: plan._id } }, { new: true });
        res.json(project);
    } catch (error) {
        console.error('Error adding plans:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports= router;