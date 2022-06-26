const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const app = express();
const port = process.env.PORT || 3000;
const usersRouter=require('./routers/user')
const tasksRouter=require('./routers/task')



// app.use((req,res,next)=>{
//   if(req.method==='GET'){
//     res.send("get requests are disabled")
//   }else{
//     next()
//   }
// })

// app.use((req,res,next)=>{
//   res.status(503).send({error:"site is down you sun of beach!"})
// })



app.use(express.json());
app.use(usersRouter)
app.use(tasksRouter)



app.listen(port, () => {
  console.log("server is up on port " + port);
});


// const main=async()=>{
//   // const task=await Task.findById('62b7183bf542e522fdf4de54')
//   // await task.populate('owner')
//   // console.log(task.owner)

//   const user=await User.findById('62b7178c4d21c250d8fb7202')
//   await user.populate('tasks')
//   console.log(user.tasks)
// }
// main()