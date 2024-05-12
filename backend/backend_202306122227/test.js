// express example
const express = require('express');
const app = express();
const port = 3002;
const Data = require('./module/Data.js');
const cors = require('cors')

app.use(cors());
// Data.testReduceTimer;
Data.updateData();


app.get('/', (req, res) => res.send('Hello World!'));
app.get("/api/test", (req, res) => {
    res.json(Data.getTestData());
});
app.get("/api/test/data", (req, res) => {
    res.json(Data.createTestData());
});

// 서버 시작
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
