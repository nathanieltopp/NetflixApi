const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("DB connection succesfull!"))
    .catch(err => console.log(err));

//setting up the json parser middleware
app.use(express.json());

//Configuring routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);


app.listen(8800, () => {
    console.log("Backend server is running!");
});