//Start server by typing node index.js in the cmd prompt
//Open browser and navigate to localhost:3000 to launch site

//Import the express module
var express = require('express');
var router = express.Router();

var app = express();
//Imports File System module which comes pre-installed with Express
var fs = require('fs');

//Block header from containing info about the server
app.disable('x-powered-by');

//Imports and sets up Handlebars module, named for its use of curly brackets {{}}
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Imports bodyParser
var bodyParser = require('body-parser');
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

//Sets port to 3000
app.set('port', process.env.PORT || 3000);

//Shortens file paths when calling on directories
//EX: can now just do /img/xxx or /css/ccc and take directly from public folder
app.use(express.static(__dirname + '/public'));

//Adds a number to each page accessed console log
var consoleNum = 0;
//Add Console Log Msgs for each page accessed
app.use(function (req, res, next) {
	consoleNum += 1;
	console.log(consoleNum + "- Looking for URL : " + req.url);
	next();
});

//ROOT, renders home.handlebars
app.get('/', function(req, res){
	res.render('home');
});

//Load and Parse the JSON 'Databases' and assign them to a variable
var usersJSON = fs.readFileSync('./users.json','utf8');
usersJSON = JSON.parse(usersJSON);

//Users page should display a JSON database
app.get('/users', function(req, res){
	console.log ("You accessed a(n) " + typeof usersJSON + " type");
	res.send(usersJSON);
});

// Control page
app.get('/users/control', function(req, res){
	res.render('control');
});

//#1 - GET aka get
app.get('/users', function(req, res){
	console.log ("GET: You accessed a(n) " + typeof usersJSON + " type");
	res.send(usersJSON);
});

/*//edit a user route
app.put('/update/:id/:firstname/:lastname', editUser);
//update user information
function editUser(req, res){
	var userEdit = req.params;
	var id = Number(userEdit.id);
	var firstname = userEdit.firstname;
	var lastname = userEdit.lastname;
	
	if(users[id]){
			var reply = {
				msg: "Updating user"
			}
				users[id] = firstname + " " + lastname;
			//write information to the file
			var data = JSON.stringify(users);
			fs.writeFile('users.json', data, finished);
			function finished(err){
				console.log('all set.');
			}
		}else{
			//reply written as an object
			var reply = {
				msg: "User does not exist."
			}	
		}
	res.send(reply);
}

//add a user route
app.get('/add/:id/:firstname/:lastname', addUser);
//add a user to the json
function addUser(req, res){
	var userAdd = req.params;
	var id = Number(userAdd.id)
	var firstname = userAdd.firstname;
	var lastname = userAdd.lastname;
	
	if(users[id]){
		var reply = {
			msg: "ID already exists."
		}
	}else{
	users[id] = firstname + " " + lastname;

	//write information to the file
		var data = JSON.stringify(users);
		fs.writeFile('users.json', data, finished);
		function finished(err){
			console.log('all set.');
		}
		
	//reply written as an object
	var reply = {
		
		msg: "User has been added."
		
	}
	}
	res.send(reply);
}
*/

//#1 - PUT aka update
app.put('/users', function(req, res){
	var body = req.body;
	console.log(body);
	res.send("Your PUT request went through properly");
});

//#1 - DELETE aka remove/delete
app.delete('/users/:id', function(req, res){
	console.log ("DELETE: You accessed a(n) " + typeof usersJSON + " type");
	res.send(usersJSON);
});

// #1 - POST aka create
// Update json using the form from /users/control
app.post('/users/submit', function(req, res){
	var newBody = req.body;
	var newid = Number(newBody.id);
	usersJSON['theUsers'].push(newBody); //https://stackoverflow.com/questions/18884840/adding-a-new-array-element-to-a-json-object
	JSONstr = JSON.stringify(usersJSON, null, 2);
	/*if(users[id]){
		var reply = {
			msg: "ID already exists."
		}
	}else{
	users[id] = firstname + " " + lastname;*/

	newBody = JSON.stringify(usersJSON, null, 2);
	fs.writeFile('./users.json', JSONstr, function (err) {
		if (err) throw err;
		console.log('Updated!');
		res.send("Your user with id of " + newBody + " has been added!");
	});
});

app.get('/users/:id', function(req, res){
	var reqData = req.params;
	res.send("The ID you entered is " + reqData.id + "!");
});

//RANDOM DATA for REALTIME DATA --DONE--
app.get('/realtime/data', function(req, res){
	rNum = Math.floor((Math.random() * 999) + 1);
	res.json({"data": rNum });
});

//REALTIME SHOW
app.get('/realtime/show', function(req, res){
	res.render('realtime');
});

//Function to let app know which port to listen to
app.listen(app.get('port'), function(){
	console.log("0- Express started on http://localhost:" + app.get('port') + " press Ctrl-C to terminate");
});