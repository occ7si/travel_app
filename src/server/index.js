const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express');
const app = express();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

// Configure express to use body-parser as middle-ware
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

// variables for geonames fetch request
const URL_GEONAMES = 'http://api.geonames.org/searchJSON?';
const geonames_userAuth = `&username=${process.env.USER_NAME_GEONAMES}`;
const geonames_settings = `&maxRows=1`;

const destination = new Object();

app.post('/getCoordForDestination', function (req,res) {
    const data = req.body;
    const cityName = `name_equals=${data.cityName}`;
    console.log(URL_GEONAMES + cityName + geonames_settings + geonames_userAuth);
    fetch(URL_GEONAMES + cityName + geonames_settings + geonames_userAuth)
    .then(res => res.json())
    .then(function(res) {
        console.dir(res);
        destination.coord_lat = res.geonames[0].lat;
        destination.coord_lng = res.geonames[0].lng;
        destination.name = data.cityName;
        console.dir(destination);
    }).then(function(result) {
        console.log('res.send()');
        res.send();
    });
});

app.get('/getAll', function (req, res) {
    // console.dir(destination);
    res.send(destination);
});