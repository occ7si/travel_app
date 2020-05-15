export function handleSubmit(event){
    event.preventDefault();

    const userInput = document.getElementById('tweet').value;
    if (userInput === '') {
        throw new Error('Error: Enter a destination!');
    }

    console.log('user input in client: ' + userInput);

    // const destination = {weather: '', image:''};

    // request to server to transform destination into coordinates
    fetch('http://localhost:3031/getCoordForDestination', {
        method: 'POST',
        credential: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({userInput:userInput})
    })
    .then(updateUI)
}


    // function getWeatherData(coord)

function updateUI() {
    console.log('inside updateUI');
    fetch('http://localhost:3031/getAll')
    .then (destData => destData.json())
    .then (function (data) {
        //TODO: update UI elements
        document.getElementById('destinationCoord').innerHTML = data.coord_lat + ' ' + data.coord_long;
        // document.getElementById('destinationWeather').innerHTML = data.temp;
        // document.getElementById('destination').innerHTML = data.coord;
    });
};

    // then request to server with destination coord to get weather

    // then request to server to get the destination image

    // then display all information in the view
    //getAll

//     fetch('http://localhost:3031/addUserInput', {
//         method: 'POST',
//         credential: 'same-origin',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userInput)
//     })
//     .then (res => res.json())
//     .then (function(res) {
//         // Client.displaySentimentAnalysis(res);


    // request to Weather API

    // request to Pxabay

// };