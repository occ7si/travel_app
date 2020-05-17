import fetch from "node-fetch";

const destination = new Object();

export function handleSubmit(event) {
    event.preventDefault();
    const userInput = document.getElementById('tweet').value;
    const userDate = document.getElementById('showDate').value;

    if (userInput === '' || userDate === '') {
        throw new Error('Error: Enter a destination and a date!');
    }

    // Request destination information for date and destination
    fetch('http://localhost:3031/getDestinationObj', {
        method: 'POST',
        credential: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({cityName:userInput, date: userDate}),
    })
    .then(res => res.json())
    .then(function(res) {
        // update destination object with new destination info
        destination.cityName = res.cityName;
        destination.date = res.date;
        destination.temp = res.temp;
        destination.image = res.image;
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
         destination temp: ${destination.temp} °C`;
         document.getElementById('destinationPicture').src = destination.image;
};