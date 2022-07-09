const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth.js");
const multer=require('multer')


// Create User
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Logging User
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
    // res.send({ user:user.getPublicProfile(), token });
  } catch (e) {
    res.status(400).send({error:e.message});
  }
});

// logout
router.post("/users/logout", authMiddleware, async (req, res) => {
  try {
    req.auth.tokens = req.auth.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.auth.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// logout all
router.post("/users/logoutall", authMiddleware, async (req, res) => {
  try {
    req.auth.tokens =[]
    await req.auth.save();
    res.send();
  } catch (e) {
    // console.log(e);
    res.status(500).send();
  }
});

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

// get user profile
router.get("/users/me", authMiddleware, async (req, res) => {
  res.send(req.auth);
});

// Get Single User
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

// Update User
router.patch("/users/me", authMiddleware,async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    updates.forEach((update) => (req.auth[update] = req.body[update]));
    await req.auth.save();
    res.send(req.auth);
  } catch (e) {
    res.status(400).send(e);
    // console.log(e)
  }
});
// router.patch("/users/:id", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "email", "password", "age"];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );
//   if (!isValidOperation) {
//     return res.status(400).send({ error: "invalid updates" });
//   }
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     updates.forEach((update) => (user[update] = req.body[update]));
//     await user.save();
//     // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });

//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//     // console.log(e)
//   }
// });

// Delete User
// router.delete("/users/:id",async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.delete("/users/me", authMiddleware,async (req, res) => {
  try {
    await req.auth.remove()
    res.send(req.auth);
  } catch (e) {
    console.log(e)
    console.log("123")
    res.status(500).send();
  }
});

// upload avatar
const upload=multer({
  dest:'./src/avatars',
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|png)$/)){
      return cb(new Error('img should be .jpg/.png'))
    }
    cb(undefined,true)
    // cb(new Error('file muse be a img'))
    // cb(undefined,true)
    // cb(undefined,false)
  }
})

router.post('/users/me/avatar',authMiddleware,upload.single('avatar'),async (req,res)=>{
  req.auth.avatar = req.file.buffer
  await req.user.save()
  res.send()
},(error,req,res,next)=>{
res.status(400).send({error:error.message})
})
// delete avatar
router.delete('/users/me/avatar',authMiddleware,async (req,res)=>{
  req.auth.avatar=undefined
  await req.user.save()
  res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
  try{
    const user=await User.findById(req.params.id)
    if(!user||!user.avatar){
      throw new Error('something went wrong')
    }
    res.set('Content-Type','image/jpg')
    res.send(user.avatar)

  }catch(e){
    res.status(404).send()
  }
})
// app.post('/upload',upload.single('upload'),(req,res)=>{
// })
module.exports = router;
