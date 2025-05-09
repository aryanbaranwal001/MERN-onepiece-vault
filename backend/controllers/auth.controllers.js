import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/jwtTokenGen.lib.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
  const {username, email, password} = req.body;
  // checks if all fields are correct
  if (!email || !username || !password) {
    return res.status(400).json({
      message: "all fields, email, username & password must be given",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }
  
  // checks if user already exits
  const user = await UserModel.findOne({ email })  
  if (user) {
    return res.status(200).json({ doesUserExist: true });
  }
  // checks this at the frontend

  //hashes password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  //creates new user
  const newUser = await new UserModel({
    username,
    email,
    password: hashPassword,
  });
  await newUser.save();

  //final response
  return res.status(201).json(newUser);
    
  } catch (error) {
    console.log("error in signup",error);
    return res.status(500).json({message:"internal server error"});
  }
};

export const login = async (req, res) => {
  
const {email, password} = req.body;

  try {
    const user = await UserModel.findOne({email});
    
    // checks if user exists and password is correct
    if (!user) {
      return res.status(400).json({message:"User not found"});
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({message:"Invalid Credentials"});
    }

    //generates token and send the username and email
    const token = generateToken(user._id, res);
    return res.status(200).json({
      email,
      isTokenGenerated: true,
    });

  } catch (error) {
    console.log("error in login",error);
    return res.status(500).json({message:"internal server error"});
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });    
  } catch (error) {
    console.log("error in logout",error);
    return res.status(500).json({message:"internal server error"})
  }
};

export const check = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(200).json({ userLoggedIn: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(200).json({ userLoggedIn: false });
    }
    return res.status(200).json({ userLoggedIn: true });
  } catch (error) {
    console.log("error in check",error);
    return res.status(500).json({message:"internal server error"});
  }
}  

export const getuser = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json(user);
  } catch (error) {
    console.log("error in getUser",error);
    return res.status(500).json({message:"internal server error"});
  }
}

export const getAuthorFromId = async (req, res) => {
  try {
    const { authorId }= req.params;
    const user = await UserModel.findById(authorId).select("username");
    return res.status(200).json(user);
  } catch (error) {
    console.log("error in getAuthorFromId",error);
    return res.status(500).json({message:"internal server error"});
  }
}