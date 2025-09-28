const express = require("express");
const { body, validationResult } = require("express-validator");
const route = express.Router();
const usermodel = require("../models/user.model");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
 

route.get("/register", (req, res) => {
  res.render("register");
});

route.post("/register",
  [
    body("email")
      .trim()
      .isEmail()
      .isLength({ min: 10 })
      .withMessage("Please enter a valid email"),
    body("name")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters"),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If errors, send back error messages
      return res
        .status(400)
        .json({ errors: errors.array(), message: "invalid" });
    }
    const { name, email, password } = req.body;
 const hashpasword = await bcrypt.hash(password, 10)
    const newuser = await usermodel.create({
      name,
      email,
      password: hashpasword,
    });

    res.json(newuser);
  }
);


route.get("/login", (req, res) => {
  res.render("login");
});


route.post( "/login",
  [
    body("email").trim().isEmail().withMessage("Enter a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: "Invalid data" });
    }

    const { email, password } = req.body;

    try {
      const user = await usermodel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials!" });
      }

      // ✅ Generate JWT Token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5h" } // Token expires in 1 hour
      );

 
      res.cookie('token', token)
      res.send("logdin")

    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  }
);

route.get('/user-deta',async(req,res)=>{
const users = await usermodel.find()
res.render('allusers',{users})
})
route.get('/delete/:id',async(req,res)=>{
  await usermodel.findByIdAndDelete(req.params.id)
res.redirect("/user/user-deta")
})


 
module.exports = route;
