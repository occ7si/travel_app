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
const USER_KEY_GEONAMES = `&username=${process.env.USER_NAME_GEONAMES}`;
const SETTINGS_GEONAMES = `&maxRows=1`;

// variables for weatherbit fetch request
const URL_WEATHERBIT = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const KEY_WEATHERBIT = `&key=${process.env.API_KEY_WEATHERBIT}`;

// variables for Pixabay fetch request
const URL_PIXABAY = 'https://pixabay.com/api/?';
const KEY_PIXABAY = `key=${process.env.API_KEY_PIXABAY}`;
const SETTINGS_PIXABAY = '&category=places&image_type=photo';

app.post('/getDestinationObj', createDestinationObj);

function createDestinationObj(req, response) {
    const destination = new Object();
    destination.cityName = req.body.cityName;
    destination.date = req.body.date;

    getCoordForDestination(destination.cityName)
    .then(function(res) {
        return getWeatherForCoord(res.geonames[0].lat, res.geonames[0].lng, destination.date);
    })
    .then(function(res) {
        console.log('enter then');
        console.dir(res);
        destination.temp = res.temp;
    })
    .then(function(res) {
        return getPictureForDest(destination.cityName);
    })
    .then(function(res) {
        destination.image = res.hits[0].webformatURL;
    })
    .then(function(res) {
        console.dir(destination);
        response.send(destination);
    })
};

function getPictureForDest(dest) {
    console.log('Inside getPictureForDest');
    const cityName = `&q=${dest}`;
    return fetch(URL_PIXABAY + KEY_PIXABAY + cityName + SETTINGS_PIXABAY)
    .then(res => res.json())
};

function getWeatherForCoord(latitude, longitude, date) {
    console.log('Inside getWeatherForCoord');
    const lat = `&lat=${latitude}`;
    const lng = `&lon=${longitude}`;
    return fetch (URL_WEATHERBIT + lat + lng + KEY_WEATHERBIT)
    .then(res => res.json())
    .then(function(res) {
        for(let i = 0; i < res.data.length; i++) {
            if(res.data[i].valid_date === date) {
                return res.data[i];
            }
        }
    })
};

function getCoordForDestination(destination) {
    console.log('Inside getCoordForDest');
    console.log(destination);
    const cityName = `name_equals=${destination}`
    return fetch (URL_GEONAMES + cityName + SETTINGS_GEONAMES + USER_KEY_GEONAMES)
    .then(res => res.json())
};