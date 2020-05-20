import fetch from "node-fetch";

const destination = new Object();
let daysLeft = 0;

export function handleSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById('destination').value;
    const departureDate = document.getElementById('date').value;

    daysLeft = timeToDeparture(document.getElementById('date').valueAsDate);

    if (userInput === '' || departureDate === '') {
        throw new Error('Error: Enter a destination and a date!');
    }

    // Request destination information for date and destination
    fetch('http://localhost:3031/getDestinationObj', {
        method: 'POST',
        credential: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({cityName:userInput, date: departureDate}),
    })
    .then(res => res.json())
    .then(function(res) {
        // update destination object with new destination info
        destination.cityName = res.cityName.charAt(0).toUpperCase() + res.cityName.slice(1);
        destination.date = res.date;
        destination.temp = res.temp;
        destination.image = res.image;
        destination.daysLeft = daysLeft;
        destination.countryName = res.countryName;
        console.dir(destination);
        updateUI();
    });
}

/**
 * Updates the UI with new destination object information
 */
function updateUI() {
        document.getElementById('destinationResult').style.visibility = 'visible';

         document.getElementById('destinationPicture').src = destination.image;
         document.getElementById('destinationCity').innerHTML = `My trip to: ${destination.cityName}, ${destination.countryName}`;
         document.getElementById('departureTime').innerHTML = `Departing: ${destination.date}`;
         document.getElementById('daysLeft').innerHTML = `${destination.cityName},
                                                                ${destination.countryName}
                                                                is ${destination.daysLeft} days away`;
         document.getElementById('destinationWeather').innerHTML = `The temperature for then is: ${destination.temp} °C`;

};

/**
 * Calculate days left to departure date
 * @param {string} date - departure date
 * @returns {number} days - days until departure
 */
function timeToDeparture(date) {
    const departureDate = date;
    const today = new Date();
    const timeDiff = departureDate.getTime() - today.getTime();
    const days = Math.ceil(timeDiff/(1000*60*60*24));
    return days;
}