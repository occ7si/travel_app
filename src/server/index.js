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

const destination = new Object();

app.post('/getCoordForDestination', function (req,res) {
    const data = req.body;
    const cityName = `name_equals=${data.cityName}`;
    fetch(URL_GEONAMES + cityName + SETTINGS_GEONAMES + USER_KEY_GEONAMES)
    .then(res => res.json())
    .then(function(result) {
        destination.coord_lat = result.geonames[0].lat;
        destination.coord_lng = result.geonames[0].lng;
        destination.name = data.cityName;
    })
    .then(function(result) {
        res.send(destination);
    }) 
});

app.post('/getWeatherForcastForCoordinates', function (req, response) {
    const data = req.body;
    const lat = `&lat=${data.lat}`;
    const lng = `&lon=${data.lng}`;
    console.log('user date: ' + data.date);

    fetch(URL_WEATHERBIT + lat + lng + KEY_WEATHERBIT)
    .then(res => res.json())
    .then(function(result) {
        const weatherForcastArray = result.data;
        for (let i = 0; i < weatherForcastArray.length; i++) {
            if(weatherForcastArray[i].valid_date === data.date) {
                destination.temp = weatherForcastArray[i].temp;
                console.dir(weatherForcastArray[i]);
                return weatherForcastArray[i];
            }
        }
    }).then(function(res) {
            response.send(res);
    })
});

app.post('/getPictureForDest', function(req, response) {
    const data = req.body;
    const cityName = `&q=${data.cityName}`;
    console.log(URL_PIXABAY + KEY_PIXABAY + cityName + SETTINGS_PIXABAY);
    fetch(URL_PIXABAY + KEY_PIXABAY + cityName + SETTINGS_PIXABAY)
    .then(res => res.json())
    .then(function (res) {
        console.dir(res.hits[0].webformatURL);
        response.send(res.hits[0]);
    })
});


app.get('/getAll', function (req, res) {
    console.log('getAll');
    res.send(destination);
});