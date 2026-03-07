import express from "express";
import { PORT } from "./config/env.js";


import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMidddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(arcjetMiddleware) // Apply Arcjet middleware globally

app.use("/api/v1/auth", authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMidddleware)

app.get("/", (req, res)=>{
  res.send("Welcome to Subscription Api");
})


app.listen(PORT, async ()=>{
  await connectToDatabase()
  console.log(`Subscription API running on http://localhost:${PORT}`);
})

export default app;