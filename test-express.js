const express = require('express');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'nonexistent.html'), err => {
        if (err) {
            console.log("sendFile error:", err.message);
            next();
        }
    });
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(5001, () => console.log('test server running'));
