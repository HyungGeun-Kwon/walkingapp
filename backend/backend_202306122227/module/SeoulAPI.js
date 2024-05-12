const Data = require('./Data.js');

// n초마다 외부 API호출하고 변수에 결과 저장
const timeinterval = 10000; // unit: ms
require("dotenv").config();
const axios = require("axios");
const params = { apiKey: process.env.Seoul_API_KEY };
const url_State = `http://t-data.seoul.go.kr/apig/apiman-gateway/tapi/v2xSignalPhaseInformation/1.0?`;
const url_Timing = `http://t-data.seoul.go.kr/apig/apiman-gateway/tapi/v2xSignalPhaseTimingInformation/1.0?`;
const url_location = `http://t-data.seoul.go.kr/apig/apiman-gateway/tapi/v2xCrossroadMapInformation/1.0?`;

const API_Status = {
    Status: 200,
    Timing: 200,
    location: 200
}

const updateData = setInterval(() => {
    axios.get(url_State, { params }).then((response) => {
        if (response.data !== null) {
            Data.setStateData(response.data);
            console.log("state is not null");
        }
    })
    .catch((error) => {
        API_Status.Status = error.response.status;
    });

    axios.get(url_Timing, { params }).then((response) => {
        if (response.data !== null) {
            Data.setTimeData(response.data);
            console.log("time is not null");
        }
    })
    .catch((error) => {
        API_Status.Timing = error.response.status;
        console.log(error);
    });

    // axios.get(url_location, { params }).then((response) => {
    //     if (response.data !== null) {
    //         Data.setLocationData(response.data);
    //         console.log("location is not null");
    //     }
    // })
    // .catch((error) => {
    //     API_Status.location = error.response.status;
    //     console.log(error);
    // });
    Data.updateData();
}, timeinterval);

module.exports = {
    updateData,
    API_Status
};
