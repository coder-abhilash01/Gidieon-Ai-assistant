const userModel = require("../models/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function postRegisterController(req, res) {
  try {
    const { fullName: { firstName, lastName }, email, password } = req.body;

    const isUserExists = await userModel.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullName: { firstName, lastName },
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn:"60m"});

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none"
});

    return res.status(201).json({
      message: "User registered successfully",
      user: { email: user.email, fullName: user.fullName },
      _id: user._id
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      let field = Object.keys(error.keyPattern)[0]; // which field failed
        if (field === "fullName.firstName") field = "Firstname";
  if (field === "fullName.lastName") field = "Lastname";
  if (field === "email") field = "Email";
      return res.status(400).json({
        message: `${field} already exists`
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}



async function postLoginController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({email
    })

    if (!user) {
        return res.status(400).json({
            message: "user does not exists with this username or email"
        })

    }

    const ispasswordMatch = await bcrypt.compare(password, user.password);
    if (!ispasswordMatch) {
        return res.status(400).json({
            message: "password does not match"
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn:"60m"});
    res.cookie("token", token,{
  httpOnly: true,
  secure: true,
  sameSite: "none"
})
   return res.status(200).json({ message: "Login successful",
    user:{email: user.email, fullName:user.fullName}, token });

}

async function postLogoutController(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error during logout" });
  }
}


module.exports = { postRegisterController, postLoginController, postLogoutController };
