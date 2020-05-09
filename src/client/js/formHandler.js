export function handleSubmit(event) {
    if ( event === null ){
        throw new Error('In handleSubmit function: Incoming event is null');
    }
    event.preventDefault();
    const userinput = document.getElementById('tweet').value;
    
    // Remove error message if any is shown
    Client.resetErrorMsg();

    // Don't make the post request if user input is empty
    if (userinput === '') {
        Client.showErrorMsg('Please enter a tweet!');
        return;
    }
    console.log("::: Form Submitted :::");

    // Make POST request to server to receive sentiment analysis for user input
    const userInput = {userinput: userinput};
    fetch('http://localhost:3031/addUserInput', {
        method: 'POST',
        credential: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput)
    })
    .then (res => res.json())
    .then (function(res) {
        Client.displaySentimentAnalysis(res);
    })
}