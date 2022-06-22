// vid 11-08 11:03

const mongoose=require('mongoose')
const validator=require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager')

const User=mongoose.model('User',{
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        } 
    },
    password:{
        type:String,
        required:true,
        minLength:7,
        trim:true,
        validate(value){
            if(value.toLoweCase().includes('password')){
                throw new Error ('your password cant be "password" DUMMY!')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age cant be negetive')
            }
        }
    }
})

// const me=new User({
//     name:' mike',
//     email:'mike@gamil.com',
//     password:"paSsword",
//     age:24
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("error! ", error);
// })

const Task=mongoose.model('Task',{
    title:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        required:false,
        default:false
    }
})

// const task=new Task({
//     title:'learn mongodb',
//     description:'asd'
// })
// task.save().then(()=>{
//     console.log(task);
// }).catch((error)=>{
//     console.log(error);
// })