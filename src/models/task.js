const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    required: false,
    default: false,
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'User'
  }
});

taskSchema.pre("save", async function (next) {
  const task = this;
  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });
