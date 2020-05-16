import fetch from "node-fetch";

const destination = new Object();

export function handleSubmit(event){
    event.preventDefault();

    const userInput = document.getElementById('tweet').value;
    const userDate = document.getElementById('showDate').value;
    if (userInput === '') {
        throw new Error('Error: Enter a destination!');
    }

    destination.date = userDate;
    destination.cityName = userInput;

    // request to server to transform destination into coordinates
    fetch('http://localhost:3031/getCoordForDestination', {
        method: 'POST',
        credential: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({cityName:userInput}),
    })
    .then(res => res.json())
    .then(function(result) {
        destination.lng = result.coord_lng;
        destination.lat = result.coord_lat;
        return fetch('http://localhost:3031/getWeatherForcastforCoordinates', {
            method: 'POST',
            credential: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({lat:result.coord_lng, lng: result.coord_lng, date: userDate})
        })
    })
    .then(function() {
        return fetch('http://localhost:3031/getPictureForDest', {
            method: 'POST',
            credential: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({cityName: destination.cityName})
        })
    })
    .then(res => res.json())
    .then(function(response) {
        console.log(response);
        destination.image = response.webformatURL;
        updateUI();
    });
};


function updateUI() {
    fetch('http://localhost:3031/getAll')
    .then (destData => destData.json())
    .then (function (data) {
        destination.lat = data.coord_lat;
        destination.lng = data.coord_lng;
        destination.cityName = data.name;
        destination.temp = data.temp;
        document.getElementById('destinationCoord').innerHTML = 
        `destination name: ${destination.cityName}
         destination lng: ${destination.lng}
         destination lat: ${destination.lat}
         destination temperature now: ${destination.temp} °C`;
         document.getElementById('destinationPicture').src = destination.image;
    });
};