require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const { userAuth } = require("./middleware/auth");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const cors = require("cors");
const initializeSocket=require('./utils/socket')
require("./utils/cronJob");
const http = require("http");
const chatRouter = require("./routes/chat");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/auth", authRouter);
app.use("/profile", userAuth, profileRouter);
app.use("/request", userAuth, requestRouter);
app.use("/user", userAuth, userRouter);
app.use("/payment", paymentRouter);
app.use('/chat',userAuth,chatRouter)
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initializeSocket(server)

connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    server.listen(PORT, () => {
      console.log(`Server is listening at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Unable to connect database", error.message);
  });
