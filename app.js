const express= require("express");
const app = express();

app.use(express.json());
//app.use(logger);
const projectPath= require("./routes/projects");
const userPath= require("./routes/users");
const mongoose= require("mongoose");
const skillPath = require ("./routes/skills");
const planPath = require("./routes/plans");
const toolPath = require("./routes/tools");
mongoose.connect("mongodb://localhost/projectDB")
        .then(()=> console.log("connected.."))
        .catch((error)=> console.log("failed ",error));


       
//Routes
app.use("/api/projects",projectPath);
app.use("/api/users",userPath);
app.use("/api/skills",skillPath);
app.use("/api/plans",planPath);
app.use("/api/tools",toolPath);
//Running the server
const port =5000;
app.listen(port,() => console.log('server is running'));

