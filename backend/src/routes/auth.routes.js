const express = require("express");
const {postRegisterController,postLoginController, postLogoutController } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register",postRegisterController)
router.post("/login",postLoginController)
router.post("/logout",postLogoutController )
router.get("/check-auth", authMiddleware, (req,res)=>{
    const user = req.user;
    res.status(200).json(
       { success: true,
        message: " Authenticated user",
        user
       }
    )

})


module.exports = router;
