require("../db/mongoose");
const User = require("../models/user");

// User.findByIdAndUpdate("62b340aa5c68d402feb95319", { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const updateAgeAndCount = async (id,age) => {
    const user=await User.findByIdAndUpdate(id,{age})
    const count =await User.countDocuments({ age});
    return count
}

updateAgeAndCount('62b340aa5c68d402feb95319',24).then((count)=>{
    console.log(count);

}).catch((e)=>{
    console.log(e)
})
