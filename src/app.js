const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const app = express();
const port = process.env.PORT || 3000;
const usersRouter=require('./routers/user')
const tasksRouter=require('./routers/task')

app.use(express.json());
app.use(usersRouter)
app.use(tasksRouter)


app.listen(port, () => {
  console.log("server is up on port " + port);
});
