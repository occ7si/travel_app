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
app.listen(3031, () => {
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

let isTempSet = false;

app.post('/getDestinationObj', createDestinationObj);

/**
 * Create a destination object
 * @param {string} req - request with city name and departure date
 * @param {string} response - callback to client with destination object
 */
function createDestinationObj(req, response) {
    const destination = new Object();
    // Set city name and date for dest object
    destination.cityName = req.body.cityName;
    destination.date = req.body.date;

    getCoordForDestination(destination.cityName)
    .then(res => {
        // set country name for dest object
        destination.countryName = res.geonames[0].countryName;
        return getWeatherForCoord(res.geonames[0].lat, res.geonames[0].lng, destination.date);
    })
    .then(res => {
        for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].valid_date === req.body.date) {
                // Set temperature for dest object
                destination.temp = res.data[i].temp;
                isTempSet = true;
            }
        }
        // set "-" for temperature if the departure is not within the next 16 days
        if (isTempSet === false) {
            destination.temp = '-';
        }
        isTempSet = false;
    })
    .then(res => {
        return getPictureForDest(destination);
    })
    .then(res => {
        destination.image = res.hits[0].webformatURL;
    })
    .then(res => {
        response.send(destination);
    })
};

/**
 * Requests image information from Pixabay API for destination
 * Returns city image or
 * returns country image if no city image is available for the destination
 * @param {Object} dest - destination
 */
function getPictureForDest(dest) {
    if (dest === '') {
        throw new Error('getPictureForDest: argument "dest" is empty');
    }
    const cityName = `&q=${dest.cityName}`;
    const countryName = `&q=${dest.countryName}`;
    return fetch (URL_PIXABAY + KEY_PIXABAY + cityName + SETTINGS_PIXABAY)
    .then(res => res.json())
    .then(res => {
        if (res.hits.length === 0) {
            return fetch (URL_PIXABAY + KEY_PIXABAY + countryName + SETTINGS_PIXABAY)
            .then(res => res.json())
        } else {
            return res;
        }
    })
};

/**
 * Requests weather information from Weatherbit API for destination
 * for departure date
 * @param {string} latitude - destination latitude
 * @param {string} longitude - destination longitude
 * @param {string} date - departure date
 */
function getWeatherForCoord(latitude, longitude, date) {
    const lat = `&lat=${latitude}`;
    const lng = `&lon=${longitude}`;
    return fetch(URL_WEATHERBIT + lat + lng + KEY_WEATHERBIT)
    .then(res => res.json())
};

/**
 * Requests lat and lng coordinates for a destination name
 * @param {string} destination - destination
 */
function getCoordForDestination(destination) {
    const cityName = `name_equals=${destination}`
    return fetch (URL_GEONAMES + cityName + SETTINGS_GEONAMES + USER_KEY_GEONAMES)
    .then(res => res.json())
};