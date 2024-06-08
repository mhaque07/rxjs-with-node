const express = require('express');
const { Observable, subscribeOn } = require('rxjs');

const app = express();
const port = 8080;

// Predefined list of data
const dataList = [];

function createDatum() {
    for (let i = 0; i < 1000; i++) {
        dataList.push(generateRandomData(i));
 }
 return dataList;
 }

function generateRandomData(id) {
    return {
        id: id+1,
        name: Math.random().toString(36).substring(7)
    };
}


// Create an observable from the dataList
const dataObservable = new Observable(subscriber => {
    createDatum().forEach(data => {
        subscriber.next(data);
    });
    subscriber.complete();
});

// REST API endpoint to get data in one go means all data at once
app.get('/data', (req, res) => {
    const responseData = [];
    
    // Subscribe to the observable and collect data
    dataObservable.subscribe({
        next(data) {
            responseData.push(data);
            console.log('Data received and added to list:', data);
        },
        error(err) {
            console.error('Something went wrong:', err);
            res.status(500).send('Internal Server Error');
        },
        complete() {
            res.json(responseData);
        }
    });
});

// REST API endpoint to get data in a streaming fashion
app.get('/observable/data', (req, res) => {
    // Set response headers to keep the connection alive
    // and send data in a streaming fashion
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Subscribe to the observable and collect data
    const subscription$ = dataObservable.subscribe({
        next(data) {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
            console.log('Data received and added to list:', data);
        },
        error(err) {
            console.error('Something went wrong:', err);
            res.status(500).send('Internal Server Error');
        },
        complete() {
            res.write('event: complete\n\n');
            res.end();
        }
    });
   // Clean up subscription when client closes connection
    req.on('close', () => {
        subscription$.unsubscribe();
        res.end();
});
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
