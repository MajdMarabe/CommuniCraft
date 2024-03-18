const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const asyncHandler= require("express-async-handler"); 
const {validateCreatUser,validateLoginUser,validateUpdateUser,User}= require("../models/User");
const {validateCreatSkill,Skill}= require("../models/Skill");
const {validateCreatTool,validateUpdateTool,Tool}= require("../models/Tool");
/**
 * @desc Get all users
 * @route /api/users
 * @method Get
 * @access public
 */

router.get("/",asyncHandler(async(req,res)=>{
    const users = await User.find().populate(); 
    res.status(200).json(users);
}));

/////////////////// get user by user name ( to let user search about other user to see his skills) //////////////////////
/**
 * @desc Get  user by username
 * @route /api/users/:username
 * @method Get
 * @access public
 */

router.get("/:username",asyncHandler(async(req,res)=>{ //  : id   id daynamic

    let user = await User.findOne({username: req.body.username}).select("-_id username email location").lean(); //  parseInt حول النص الى عدد  يلي هو الايدي يلي بياخدها من الريكويست
    if (user) {
        res.status(200).json(user); // اذا الكتاب موجود في الاري , 200: نجح  , ويرسله الكتاب 
    }
    else{
        res.status(404).json({ message:"user not found"});
    }
})) ;

    /**
 * @desc  Creat new users
 * @route /api/users
 * @method Post
 * @access public
 */

// post method يعمل : new obj (new book)and save it in DB



router.post("/register", asyncHandler(async(req, res) => {
    // Validate the request body
    const { error } = validateCreatUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "This user already registered" });
    }

    // Check if the skill exists
    let skill = await Skill.findOne({ skill_Name: req.body.skill_Name });
    if (!skill) {
        return res.status(400).json({ message: "Skill not found" });
    }

    // Create a new user object with the skill's ObjectId
    user = new User({
        username: req.body.username,
        email: req.body.email,
        location: req.body.location,
        skill_Name: [skill._id], // Assign the ObjectId of the skill
        password_hash: req.body.password_hash
    });

    try {
        const result = await user.save();
        const token = null;
        const { password_hash, ...other } = result._doc;
        res.status(201).json({ ...other, token });
    } catch (err) {
        console.error(err); // Log the error message
        res.status(500).json({ message: " the user name already registered" });
    }
    
}));


/*
router.post("/register",asyncHandler(async(req,res) =>{

    // method joi.object  عملت اوبجكت داخل  
    // بدي اعمل validation
console.log(req.body);
    const {error} = validateCreatUser(req.body);
if(error){
 return res.status(400).json({message: error.details[0].message}); // 400:  المشكلة من الكلينت مش السيرفر
                                                            
       }// اذا كلشي valid حيرجع null  ,ويكمل الكود طبيعي 

       let user = await  User.findOne({email: req.body.email}); 
       if(user){

         return res.status(400).json({message:"this user already registered"});
       }

const salt = await bcrypt.genSalt(10);
req.body.password_hash = await bcrypt.hash(req.body.password_hash, salt);
try{
 user = new User (
            // client هدول البيانات نحتاجها من 
     {
         username:  req.body.username,
         email: req.body.email,
         location : req.body.location,
         skill_Name : req.body.skill_Name,
         password_hash: req.body.password_hash


    }  );
    const result = await user.save();
    const token = null;
    const {password_hash, ...other } = result._doc;
    res.status(201).json({...other, token}); 
}catch (err){


    console.error(err);
    res.status(500).json({ message: "Skill not found" });


}
   
       
}));

*/
   /**
 * @desc  login
 * @route /api/users/login
 * @method Post
 * @access public
 */


router.post("/login",asyncHandler(async(req,res) =>{

    // method joi.object  عملت اوبجكت داخل  
    // بدي اعمل validation
console.log(req.body);
    const {error} = validateLoginUser(req.body);
if(error){
 return res.status(400).json({message: error.details[0].message}); // 400:  المشكلة من الكلينت مش السيرفر
                                                            
       }// اذا كلشي valid حيرجع null  ,ويكمل الكود طبيعي 

       let user = await  User.findOne({email: req.body.email}); 
       if(!user){

         return res.status(400).json({message:"invalid email"});
       }
let passwordMatch= await bcrypt.compare(req.body.password_hash,user.password_hash);
console.log(req.body.password_hash , user.password_hash,passwordMatch);
if(!passwordMatch){
    return res.status(400).json({message:"invalid password"});
}
const token = null;
const {password_hash, ...other}=user._doc;
res.status(200).json({...other, token }); 

 
}));


/**
 * @desc update a user 
 * @route /api/user/:id
 * @method PUT
 * @access private
 * */
 
// PUT:(id بيعمل ابديت على اوبجكت معين (نحتاج  

router.put("/:id",asyncHandler(async(req,res)=>{ 
    // لازم نعمل فاليديشن على البيانات رح تيجي من الكلينت
    const {error}= validateUpdateUser(req.body);

    if(error){
        return res.status(400).json({ message: error.details[0].message}); // برجع المسج يلي رح ياخدها من الايرور

    }
    if(req.body.password_hash){
        const salt = await bcrypt.genSalt(10);
        req.body.password_hash = await bcrypt.hash(req.body.password_hash, salt);
  
    }

    const updateduser = await User.findByIdAndUpdate(req.params.id ,{
        $set: {
            
            username:  req.body.username,
            email: req.body.email,
            location : req.body.location,
            skill_Name : req.body.skill_Name,
            password_hash: req.body.password_hash

        }
    } , {new: true }).select("-password_hash"); //عشان يعطي للكلينت الابديت بوك
 
    res.status(200).json(updateduser);
})); 




/**
 * @desc Delete a user
 * @route /api/user/:id
 * @method DELETE
 * @access public
 */
// delete:(id بيعمل حذف على اوبجكت المطلوب حذفه (نحتاج  

router.delete("/:id",asyncHandler(async(req,res)=>{ 
   
   
    // 
    const user= await User.findByIdAndDelete(req.params.id) ;
    
    if(user){
    res.status(200).json({ message:"user has been deleted"});
}
else{
    res.status(404).json({ message:"user not found"});
}
}));

/**
 * @desc get skill by id
 * @route /api/user/:id
 * @method GET
 * @access public
 */
// 
/*
router.get("/match-users/:skill_Name",asyncHandler(async(req,res)=>{ //  : id   id daynamic

   // let user = await User.findOne({username: req.body.username}).select("-_id username email location").lean(); //  parseInt حول النص الى عدد  يلي هو الايدي يلي بياخدها من الريكويست
   const { skill_Name } = req.params;
   const users = await User.find({ skills: skill_Name });
   if (users) {
   
    res.status(200).json(users);
    }
    else{
        res.status(404).json({ message:"user not found"});
    }
})) ;
*/

router.get("/match-users/:skill_Name", asyncHandler(async(req,res) => {
    const { skill_Name } = req.params;
    const users = await User.find({ skill_Name: skill_Name });
    if (users && users.length > 0) {
        res.status(200).json(users);
    } else {
        res.status(404).json({ message:"users not found with this skill" });
    }
}));






///////////////// Adding tool to the user 
router.post('/:userId/tools1', async (req, res) => {
    const { userId } = req.params;
    const { tool_Name } = req.body;
    try {
        // Find the user based on the provided email
        const tool = await Tool.findOne({ tool_Name });
        if (!tool) {
            return res.status(404).json({ error: 'tool not found' });
        }
       
        const user = await User.findByIdAndUpdate(userId, { $push: { tools1: tool._id } }, { new: true });
        res.json(user);
    } catch (error) {
        console.error('Error adding tools:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





module.exports= router;