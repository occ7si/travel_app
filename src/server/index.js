const dotenv = require('dotenv');
dotenv.config();

var path = require('path');
const express = require('express');
const app = express();

const AYLIENTextAPI = require("aylien_textapi");
let textapi = new AYLIENTextAPI({
    application_id: process.env.API_ID,
    application_key: process.env.API_KEY
});

const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Look for asset files in the dist instead of the client folder
app.use(express.static('dist'))

console.log(__dirname)

// designates what port the app will listen to for incoming requests
app.listen(3031, function () {
    console.log('Example app listening on port 3031!')
})

// Make sentiment request to Aylien API for user input
app.post('/addUserInput', function(req, res) {
    const data = req.body;
    textapi.sentiment({
        'text': data.userinput
    }, function(error, response) {
        if (error === null) {
            res.send(response);
        } else {
            console.log('Error response received from Aylien request: ' + error);
        }
    })
});