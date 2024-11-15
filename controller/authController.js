const User = require("../Model/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('704779486387-9e6mfbtp9jh9l37pifmuggdcjdaer1r1.apps.googleusercontent.com');

exports.googleLogin = async (req, res) => {
    const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: client
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];

    // Find or create user in your database
    let user = await User.findOne({ googleId: userId });
    if (!user) {
      user = await User.create({
        googleId: userId,
        email: payload['email'],

      });
    }

    // Generate JWT session token
    const token = jwt.sign({ id: user._id }, "Secret", { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token' });
  }
};







exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("loginnnn", email, password);


    try {
        console.log("tree",email);
        
    const user = await User.findOne({ email });
    console.log(user.email,"sdbsbndbsd");
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({ token});
  } catch (error) {
    console.log("sdcsdcfs");
    
    res.status(500).json({ error: "Login error" });
  }
};

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    console.log("saddcsf",req.body)

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Signup error" });
  }
};