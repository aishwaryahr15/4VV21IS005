const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3000;

let numbersStore = [];
const windowSize = 10;
const startTime = Date.now();

app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;
    try {
        const response = await axios.get(`http://test-server.com/fetch?number=${numberId}`);
        const fetchedNumbers = response.data.numbers;

        // Process numbers based on numberId
        let processedNumbers = fetchedNumbers;
        switch (numberId) {
            case 'p':
                processedNumbers = _.filter(fetchedNumbers, n => isPrime(n));
                break;
            case 'f':
                processedNumbers = _.filter(fetchedNumbers, n => isFibonacci(n));
                break;
            case 'e':
                processedNumbers = _.filter(fetchedNumbers, n => isEven(n));
                break;
            case 'r':
                processedNumbers = _.sampleSize(fetchedNumbers, windowSize);
                break;
        }

        // Update numbersStore and calculate average
        updateNumbersStore(processedNumbers);
        const avg = calculateAverage(numbersStore);

        // Prepare response
        const windowPrevState = getPreviousWindowState();
        const windowCurrState = numbersStore.slice(-windowSize);
        const formattedResponse = {
            windowPrevState,
            windowCurrState,
            numbers: fetchedNumbers,
            avg
        };

        res.json(formattedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching numbers');
    }
});

function updateNumbersStore(newNumbers) {
    // Ensure uniqueness and window size
    numbersStore = _.uniq([...numbersStore, ...newNumbers]).slice(0, windowSize);
}

function calculateAverage(numbers) {
    return Math.round(_.mean(numbers) * 100) / 100;
}

function getPreviousWindowState() {
    return numbersStore.slice(0, windowSize - 1);
}

// Helper functions for number processing
function isPrime(num) {
    // Implementation depends on available API or logic
    return true; // Placeholder
}

function isFibonacci(num) {
    // Implementation depends on available API or logic
    return true; // Placeholder
}

function isEven(num) {
    return num % 2 === 0;
}

app.listen(port, () => {
    console.log(`Average Calculator listening at http://localhost:${port}`);
});
