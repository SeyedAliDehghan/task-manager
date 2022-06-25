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
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get Single Task
router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send({error:'task not found'});
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});
// Update Task
router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  allowedUpdates = ["title", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid update" });
  }
  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const task = await Task.findById(req.params.id);
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
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
