import fetch from "node-fetch";

const destination = new Object();
let daysLeft = 0;

export function handleSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById('tweet').value;
    const departureDate = document.getElementById('showDate').value;

    daysLeft = timeToDeparture(document.getElementById('showDate').valueAsDate);

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
        destination.cityName = res.cityName;
        destination.date = res.date;
        destination.temp = res.temp;
        destination.image = res.image;
        destination.countryName = res.countryName;
        console.dir(destination);
        updateUI();
    });
}

/**
 * Updates the UI with new destination object information
 */
function updateUI() {
    document.getElementById('destinationCoord').innerHTML =
        `destination name: ${destination.cityName}
         destination date: ${destination.date}
         destination temp: ${destination.temp} °C
         days left until departure: ${daysLeft} days
         country: ${destination.countryName}`;
         document.getElementById('destinationPicture').src = destination.image;
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