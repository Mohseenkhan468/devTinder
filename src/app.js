const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter=require('./routes/auth');
const profileRouter = require("./routes/profile");
const requestRouter=require('./routes/request')
const {userAuth}=require('./middleware/auth')
const userRouter=require('./routes/user')
app.use(express.json());
app.use(cookieParser());


app.use('/auth',authRouter)
app.use('/profile',userAuth,profileRouter)
app.use('/request',userAuth,requestRouter)
app.use('/user',userAuth,userRouter)

connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(5000, () => {
      console.log("Server is listening");
    });
  })
  .catch((error) => {
    console.log("Unable to connect database", error.message);
  });
