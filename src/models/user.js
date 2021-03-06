const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task=require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('your password cant be "password" DUMMY!');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age cant be negetive");
      }
    },
  },
  avatar:{
    type:Buffer
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]
},{
  timestamps:true
});

userSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("user not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login - Password mismatch");
  }
  return user;
};

userSchema.methods.generateAuthToken = async function(){
  const user=this
  const token=jwt.sign({_id:user._id.toString()},'thisismytoken')
  user.tokens=user.tokens.concat({token})
  await user.save()
  return token
};
userSchema.methods.toJSON= function(){
  const user=this
  const userObject=user.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}
// userSchema.methods.getPublicProfile= function(){
//   const user=this
//   const userObject=user.toObject()
//   delete userObject.password
//   delete userObject.tokens
//   return userObject
// }

// hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// delete user tasks when user deleted
userSchema.pre('remove',async function(next){
  const user=this
  await Task.deleteMany({owner:user._id})
  next()
})

const User = mongoose.model("User", userSchema);

module.exports = User;
