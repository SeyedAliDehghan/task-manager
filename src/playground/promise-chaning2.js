require('../db/mongoose')
const Task=require('../models/task')
// Task.findByIdAndDelete('62b2555b070884481ae96520').then((task)=>{
//     console.log(task)
//     return Task.countDocuments({})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount=async (id)=>{
    await Task.findByIdAndDelete(id)
    const count=await Task.countDocuments({completed:false})
    return count
}
deleteTaskAndCount('62b345cb674e68d7056ace60').then((count)=>{console.log(count)}).catch((e)=>{console.log(e)})