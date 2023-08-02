// Dependencies and Modules
const User = require("../models/User");
const bcrypt = require('bcrypt');
const auth = require('../auth');


module.exports.checkEmailExists = (reqBody) => {
	return User.find({email: reqBody.email}).then(result => {

		// The "find" metho
		// returns a record if a match is found.
		if(result.length > 0) {
			return true; //"Duplicate email found"
		} else {
			return false;
		}
	})
};



// User Registration Function
/*
	Business Logic:
		1. Create a new User object using the mongoose model and the information from the request body.
		2. Make sure that the password is encrypted
		3. Save the new User to the database.
*/

module.exports.registerUser = (reqBody) => {

	// Creates a variable newUser and instantiates a new User object using the mongoose model.
	// Uses the information from the request body to provide all the necessary information about the User object.
	let newUser = new User({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		// 10 - is the number of salt rounds that bcrypt algorithm will run in order to encrypt the password.
		password: bcrypt.hashSync(reqBody.password, 10)
	})

	// Saves the created object to our database
	return newUser.save().then((user, error) => {
		// User registratioon failed
		if(error) {
			return false;
		// User registration successful
		} else {
			return true;
		}
		// catch() code block will handle other kinds of error.
		// prevent our app from crashing when an error occured in the backend server.
	}).catch(err => err)

};


// User Authentication Function
/*
	Business Logic:
	1. Check the database if the user email exists.
	2. Compare the password provided in the login from the password stored in the database.
	3. Generate/return a JSON web token if the user is successfully logged in and return false if not.
*/

module.exports.loginUser = (req, res) => {
	return User.findOne({email: req.body.email}).then(result => {
		// User does not exist.
		console.log(result);
		if(result == null) {
			return res.send(false)
		} else {
			// Created the isPasswordCorrect variable to return the result of comparing the login form password and the database password.
			// compareSync() method is used to compare the non-encrypted password from the login form to the encrypted password from the database.
				// will return either "true" or "false"
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

			if(isPasswordCorrect) {
				// Generate an access token
				// Uses the "createAccessToken" method defined in the "auth.js" file. 
				// Returning an object back to the frontend application is a common practice to encure that information is properly labled and real world examples normally return more complex information represented by objects.
				return res.send({access: auth.createAccessToken(result)})
			} else {
				// If password is incorrect.
				return res.send(false);
			}
		}
	}).catch(err => res.send(err));

};


module.exports.getProfile = (req, res) => {


	return User.findById(req.user.id).then(result => {

		// Changes the value of the user's password to an empty string when returned to the frontend
		// Not doing so will expose the user's password which will also not be needed in other parts of our application
		// Unlike in the "register" method, we do not need to call the mongoose "save" method on the model because we will not be changing the password of the user in the database but only the information that we will be sending back to the frontend application
		result.password = "";

		// Returns the user information with the password as an empty string
		return res.send(result);

	})
	.catch(err => res.send(err))
};







// Function to reset the password
module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports.updateProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    const { firstName, lastName, mobileNo } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};


//[ACTIVITY] Update user as admin controller
module.exports.updateUserAsAdmin = async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Find the user and update isAdmin flag
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.isAdmin = true;
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json(true);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the user as admin' });
    }
  };


