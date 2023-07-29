// Dependencies and Modules
const express = require('express');
const userController = require('../controllers/user');
const auth = require('../auth');

// destructure the auth file:
// here we use the verify and verifyAdmin as auth middlewares.
const { verify, verifyAdmin } = auth;


const router = express.Router();





// Route for checking if user email already exist.
router.post("/checkEmail", (req, res) => {
	userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
});


// Route for user registration
router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
});


// Route for user authentication
// Here  we have streamlined the login routes by directly invoking the "loginUser" function. Consiquently, the req.body will now be incorporated into the controller function.
router.post("/login", userController.loginUser);


//[ACTIVITY] Route for retrieving user details
// router.post("/details", userController.getProfile);


// Route for retrieving authenticated user details
router.get("/details", verify, userController.getProfile)

// Route for resetting the password
router.put('/reset-password', verify, userController.resetPassword);


// Update user profile route
router.put('/profile', verify, userController.updateProfile);


//[ACTIVITY] Update Admin route
    router.put('/updateAdmin', verify, verifyAdmin, userController.updateUserAsAdmin);





module.exports = router;