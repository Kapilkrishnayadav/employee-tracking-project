const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://yadavkapil2336:yadav2@cluster0.ek5syoj.mongodb.net/placementproject"
  )
  .then(() => {
    console.log("running succesfully");
  })
  .catch((err) => {
    console.log(err);
  });
const Schema = mongoose.Schema;

const Register = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  login: {
    type: Boolean,
    default: false,
  },
  count: {
    type: Number,
    default: 0,
  },
});
const register = mongoose.model("register", Register);

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  // console.log(data.confirmPassword);
  const data = req.body;

  try {
    // Check if the user already exists in the database
    const existingUser = await register.findOne({ email: data.email });

    if (existingUser) {
      // If user exists, respond with an error message

      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // If user doesn't exist, save the data
    const registerData = new register({
      name: data.name,
      email: data.email,
      password: data.password,
      login: false,
      count: 0,
    });

    const savedData = await registerData.save();
    res.json("Saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while saving the data" });
  }
});

app.put("/login", async (req, res) => {
  const data = req.body;
//   console.log(data);
  try {
    const existingUser = await register.findOne({
      email: data.email,
      password: data.password,
    });
    if (!existingUser) {
      console.log("not exist");
      return res.status(201).json({ error: "User does not exist" });
    }

    let id = existingUser._id;
    console.log(existingUser);
    const registerData = await register.findByIdAndUpdate(
      id, // ID of the document to update
      { $set: { login: true } }, // Update operation using $set operator
      { new: true } // Options: return the updated document
    );
    res.json({response:"success",id:id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while saving the data" });
  }
});

app.put("/logout", async (req, res) => {
    const _id = req.body;
    const id=new ObjectId(_id.id);
    console.log(id.id);
    try {
        const registerData = await register.findByIdAndUpdate(
            id, // ID of the document to update
            { 
              $set: { login: false }, // Update login field to false
              $inc: { count: 1 } // Increment count field by 1
            },
            { new: true } // Options: return the updated document
          );
          
          res.json({response:"Log out"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while saving the data" });
      }
})
app.get("/dashboard", async (req, res) => {
    try {

      
  
      // Fetch data from the database with pagination
      const data = await register.find();
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching dashboard data" });
    }
  });
  
const port = process.env.PORT || 3001;
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server started at http://localhost:" + port);
});
