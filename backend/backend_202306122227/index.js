// express example
const express = require('express');
const app = express();
const port = 3001;
const Data = require('./module/Data.js');
const SeoulAPI = require('./module/SeoulAPI.js');


// SeoulAPI.updateData;
Data.updateData();


app.get('/', (req, res) => res.send('Hello World!'));
app.get("/api/records", (req, res) => {
    if(SeoulAPI.API_Status.Status !== 200 || SeoulAPI.API_Status.Timing !== 200 || SeoulAPI.API_Status.location !== 200) {
        res.status(SeoulAPI.API_Status_status).send('ERROR!');
        return;
    }
    res.json(Data.getResult());
});
app.get("/api/bound", (req, res) => {
    if(SeoulAPI.API_Status.Status !== 200 || SeoulAPI.API_Status.Timing !== 200 || SeoulAPI.API_Status.location !== 200) {
        res.status(SeoulAPI.API_Status_status).send('ERROR!');
        return;
    }
    res.json(Data.createBoundData(req.query.p1_lat, req.query.p1_lot, req.query.p2_lat, req.query.p2_lot));
});
app.get("/api/surround", (req, res) => {
    if(SeoulAPI.API_Status.Status !== 200 || SeoulAPI.API_Status.Timing !== 200 || SeoulAPI.API_Status.location !== 200) {
        res.status(SeoulAPI.API_Status.Status).send('ERROR!');
        return;
    }
    res.json(Data.createSurroundingData(req.query.lat, req.query.lot, req.query.radius));
});

app.get("/api/test", (req, res) => {
    res.json(Data.getResult());
});

// 서버 시작
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
