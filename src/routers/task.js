const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const authMiddleWare=require('../middleware/auth')

// Create A Task
router.post("/tasks",authMiddleWare, async (req, res) => {
  //const task = new Task(req.body);
  const task=new Task({
    ...req.body,
    owner:req.auth._id
  })
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get All Tasks
// get /tasks?completed=true
//  get /task?limit=10%skip=0
// get /tasks?sortBy={field}{_dec\ace}
router.get("/tasks",authMiddleWare, async (req, res) => {
  const match={}
  const sort={}
  if(req.query.completed){
    match.completed=req.query.completed==='true'
  }
  if(req.query.sortBy){
    const parts=req.query.sortBy.split('_')
    sort[parts[0]]=parts[1]==='desc'?-1:1
  }
  try {
    // const tasks = await Task.find({owner:req.auth._id});
    await req.auth.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort:{
          createdAt:1
        }
      }
    })
    if(req.auth.tasks.length===0){
      return res.status(404).send()
    }
    res.send(req.auth.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get Single Task
router.get("/tasks/:id",authMiddleWare, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(_id);
    const task=await Task.findOne({_id,owner:req.auth._id})
    if (!task) {
      return res.status(404).send({error:'task not found'});
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});
// Update Task
router.patch("/tasks/:id",authMiddleWare, async (req, res) => {

  const updates = Object.keys(req.body);
  allowedUpdates = ["title", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid update" });
  }
  try {
    const task=await Task.findOne({_id:req.params.id,owner:req.auth._id})
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    // const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save()
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// ِDelete Task
router.delete("/tasks/:id",authMiddleWare, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.auth._id});
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
