import fetch from "node-fetch";

export function handleSubmit(event){
    event.preventDefault();

    const userInput = document.getElementById('tweet').value;
    if (userInput === '') {
        throw new Error('Error: Enter a destination!');
    }

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
        console.dir(result);
        fetch('http://localhost:3031/getWeatherforCoordinates', {
            method: 'POST',
            credential: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(result)
        });
    })
    .then(function() {
        updateUI();
    });
};

const destination = new Object();

function updateUI() {
    fetch('http://localhost:3031/getAll')
    .then (destData => destData.json())
    .then (function (data) {
        destination.lat = data.coord_lat;
        destination.lng = data.coord_lng;
        destination.name = data.name;
        destination.temp = data.temp;
        document.getElementById('destinationCoord').innerHTML = 
        `destination name: ${destination.name}
         destination lng: ${destination.lng}
         destination lat: ${destination.lat}
         destination temperature now: ${destination.temp} °C`;
    });
};