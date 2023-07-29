// Server Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require("./routes/user");

// Server Setup
const app = express();

// Environment Setup
const port = 4000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Allows all resources(frontend app) to acces our backend application.
app.use(cors());


// Mongoose Connection
mongoose.connect("mongodb+srv://rieyzyguerra:admin123@batch295.kxfkqps.mongodb.net/carrie-backend?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	);


let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => console.log('Connected to MongoDB Atlas.'));

// Backend Routes
// http://localhost:4000/users
app.use("/users", userRoutes);



// Relationship of the server files

/*
				request		response
					|			|
	index.js <----> route files <----> controller files <----> model files

*/


// Server Gateway Response
if(require.main === module) {
	app.listen(process.env.PORT || port, () => { console.log(`Server is now running in port ${process.env.PORT || port}.`)});
};


module.exports = {app,mongoose};