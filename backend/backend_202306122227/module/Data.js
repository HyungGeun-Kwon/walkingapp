const Mock_location = require("../data/1_location.json");
const Mock_state = require("../data/2_state.json");
const Mock_time = require("../data/3_time.json");
const Mock_maxTime = require("../data/4_maxTime.json");
var state = Mock_state;
var time = Mock_time;
var location = Mock_location;
var maxTime = Mock_maxTime;
var resultData = [];
var testData = [];
var testMockData = [];

const setStateData = (newState) => {
    state = newState;
};
const getStateData = () => {
    return state;
};
const setTimeData = (newTime) => {
    time = newTime;
};
const getTimeData = () => {
    return time;
};
const setLocationData = (newLocation) => {
    location = newLocation;
};
const getLocationData = () => {
    return location;
};

const mergeData = () => {
    var _ = require('lodash');

    // // state와 time을 itstId를 기준으로 합치기
    // var result = [];
    // for (var i = 0; i < state.length; i++) {
    //     for (var j = 0; j < time.length; j++) {
    //         if (state[i].itstId === time[j].itstId) {
    //             // result.push(Object.assign({}, state[i], time[j]));
    //             result.push(_.merge({}, state[i], time[j]));
    //         }
    //     }
    // }
    // location과 state를 itstId를 기준으로 합치기
    var result_merge0 = [];
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < location.length; j++) {
            if (state[i].itstId === location[j].itstId) {
                // result.push(Object.assign({}, state[i], time[j]));
                result_merge0.push(_.merge({}, state[i], location[j]));
            }
        }
    }
    // time과 result_merge0를 itstId를 기준으로 합치기
    var result_merge = [];
    for (var i = 0; i < result_merge0.length; i++) {
        for (var j = 0; j < time.length; j++) {
            if (result_merge0[i].itstId === time[j].itstId) {
                // result.push(Object.assign({}, state[i], time[j]));
                result_merge.push(_.merge({}, result_merge0[i], time[j]));
            }
        }
    }
    // maxTime과 result_merge를 itstId를 기준으로 합치기
    var result_merge2 = [];
    for (var i = 0; i < result_merge.length; i++) {
        for (var j = 0; j < maxTime.length; j++) {
            if (result_merge[i].itstId === maxTime[j].itstId) {
                result_merge2.push(_.merge({}, result_merge[i], maxTime[j]));
            }
        }
    }

    // st -> wt
    for (var i = 0; i < result_merge2.length; i++) {
        if (result_merge2[i].itstId == '1850' || result_merge2[i].itstId == '1835') {
            result_merge2[i].wtPdsgStatNm = result_merge2[i].stPdsgStatNm;
            result_merge2[i].wtPdsgRmdrCs = result_merge2[i].stPdsgRmdrCs;
            delete result_merge2[i].stPdsgStatNm;
            delete result_merge2[i].stPdsgRmdrCs;
        }
    }
    // nt -> et
    for (var i = 0; i < result_merge2.length; i++) {
        if (result_merge2[i].itstId == '21835' || result_merge2[i].itstId == '21850') {
            result_merge2[i].etPdsgStatNm = result_merge2[i].ntPdsgStatNm;
            result_merge2[i].etPdsgRmdrCs = result_merge2[i].ntPdsgRmdrCs;
            delete result_merge2[i].ntPdsgStatNm;
            delete result_merge2[i].ntPdsgRmdrCs;
            // console.log(result_merge2[i]);
        }
    }
    

    return result_merge2;
};

const removeData = (mergeData) => {
    // mergeData dataId, trsmDy, trsmUtcTime, trsmYear, trsmMt, trsmTm, trsmMs, 
    //                  eqmnId, rgtrId, regDt, itstEngNm, laneWidth, limitSpedTypeNm, limitSped, msgCreatMin, msgCreatDs 삭제
    const del_key = ["dataId", "trsmDy", "trsmUtcTime", "trsmYear", "trsmMt", "trsmTm", "trsmMs",
            "eqmnId", "rgtrId", "regDt", "itstEngNm", "laneWidth", "limitSpedTypeNm", "limitSped", "msgCreatMin", "msgCreatDs"];
    for (var i = 0; i < mergeData.length; i++) {
        for (var j = 0; j < del_key.length; j++) {
            delete mergeData[i][del_key[j]];
        }
    }
    return mergeData;
};

const getPdsgData = (mergeData) => {
    // mergeData[i] 에서 "sg"를 포함하는 키 값을 검색
    for (var i = 0; i < mergeData.length; i++) {
        for (var key in mergeData[i]) {
            if (mergeData[i].hasOwnProperty(key)) {
                if (key.includes("sg")) {
                    if (!key.includes("Pdsg")){
                        delete mergeData[i][key];
                    }
                    if (mergeData[i][key] === null) {
                        delete mergeData[i][key];
                    }
                }
            }
        }
    }
    // // mapCtptIntLat와 mapCtptIntLot를 xx.xxxxx 형식으로 변환
    // for (var i = 0; i < mergeData.length; i++) {
    //     mergeData[i].mapCtptIntLat = mergeData[i].mapCtptIntLat / 10000000;
    //     mergeData[i].mapCtptIntLot = mergeData[i].mapCtptIntLot / 10000000;
    // }
    return mergeData;
};

const correctPos = (data) => {
    const earth = 6378.137;
    const pi = Math.PI;
    const m = (1 / ((2 * pi / 360) * earth)) / 1000;
    const cos = Math.cos;

    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (data[i].hasOwnProperty(key)) {
                if (key.includes("PdsgStat")) {
                    if (key.includes("nt")) {
                        data[i].NewmapCtptIntLat = data[i].mapCtptIntLat + 10 * m;
                        data[i].NewmapCtptIntLot = data[i].mapCtptIntLot;
                    }
                    
                    if (key.includes("et")) {
                        data[i].NewmapCtptIntLat = data[i].mapCtptIntLat;
                        data[i].NewmapCtptIntLot = data[i].mapCtptIntLot + (10 * m) / cos(data[i].mapCtptIntLat * (pi / 180));
                    }
                    
                    if (key.includes("st")) {
                        data[i].NewmapCtptIntLat = data[i].mapCtptIntLat + -10 * m;
                        data[i].NewmapCtptIntLot = data[i].mapCtptIntLot;
                    }
                    
                    if (key.includes("wt")) {
                        data[i].NewmapCtptIntLat = data[i].mapCtptIntLat;
                        data[i].NewmapCtptIntLot = data[i].mapCtptIntLot + (-10 * m) / cos(data[i].mapCtptIntLat * (pi / 180));
                    }
                    
                    if (key.includes("ne")) {
                        data[i].NewmapCtptIntLat = data[i].mapCtptIntLat + 10 * m;
                        data[i].NewmapCtptIntLot = data[i].mapCtptIntLot + (10 * m) / cos(data[i].mapCtptIntLat * (pi / 180));
                    }
                    
                    if (key.includes("nw")) {
                        data[i].NewmapCtptIntLat = data[i].mapCtptIntLat + 10 * m;
                        data[i].NewmapCtptIntLot = data[i].mapCtptIntLot + (-10 * m) / cos(data[i].mapCtptIntLat * (pi / 180));
                    }
                    
                    if (key.includes("se")) {
                        data[i].NewmapCtptIntLat = data[i].mapCtptIntLat + -10 * m;
                        data[i].NewmapCtptIntLot = data[i].mapCtptIntLot + (10 * m) / cos(data[i].mapCtptIntLat * (pi / 180));
                    }
                    
                    if (key.includes("sw")) {
                        data[i].NewmapCtptIntLat = data[i].mapCtptIntLat + -10 * m;
                        data[i].NewmapCtptIntLot = data[i].mapCtptIntLot + (-10 * m) / cos(data[i].mapCtptIntLat * (pi / 180));
                    }
                    
                    data[i].NewmapCtptIntLat = parseFloat((data[i].NewmapCtptIntLat).toFixed(7));
                    data[i].NewmapCtptIntLot = parseFloat((data[i].NewmapCtptIntLot).toFixed(7));
                }
            }
        }
    }
    return data;
};

const createBoundData = (p1_lat, p1_lot, p2_lat, p2_lot) => {
    var data = resultData;
    // 동묘앞역 <-> 을지로 4가
    // var max_mapCtptIntLat = 37.5730228;
    // var min_mapCtptIntLat = 37.5673779;
    // var max_mapCtptIntLot = 127.0156343;
    // var min_mapCtptIntLot = 126.9980969;
    var max_Lat = Math.max(p1_lat, p2_lat);
    var min_Lat = Math.min(p1_lat, p2_lat);
    var max_Lot = Math.max(p1_lot, p2_lot);
    var min_Lot = Math.min(p1_lot, p2_lot);

    // max min을 기준으로 경계값을 넘어가는 데이터 삭제
    for (var i = 0; i < data.length; i++) {
        if (data[i].mapCtptIntLat > max_Lat || data[i].mapCtptIntLat < min_Lat) {
            delete data[i];
            continue;
        }
        if (data[i].mapCtptIntLot > max_Lot || data[i].mapCtptIntLot < min_Lot) {
            delete data[i];
            continue;
        }
    }
    
    // null값 삭제
    data = data.filter((element, i) => element != null);

    return data;
};

const dedupeData = (data) => {
    // data 에서 itstId가 같으면 하나 제거
    for (var i = 0; i < data.length; i++) {
        for (var j = i + 1; j < data.length; j++) {
            for (Ikey in data[i]) {
                for (Jkey in data[j]){
                    if (Ikey.includes("itstId") && Jkey.includes("itstId")) {
                        if (data[i][Ikey] === data[j][Jkey]) {
                            data.splice(j, 1);
                            continue;
                        }
                    }
                }
            }
        }
    }
    return data;
};

const createSurroundingData = (lat, lot, radius) => {
    var data = resultData;
    data = data.filter((element, i) => element != null);

    const earth = 6378.137;
    const pi = Math.PI;
    const m = (1 / ((2 * pi / 360) * earth)) / 1000;

    // radius string to float
    radius = parseFloat(radius);
    lat = parseFloat(lat);
    lot = parseFloat(lot);

    var max_Lat = lat + radius * m;
    var min_Lat = lat - radius * m;
    var max_Lot = lot + radius * m;
    var min_Lot = lot - radius * m;

    // max min을 기준으로 경계값을 넘어가는 데이터 삭제
    for (var i = 0; i < data.length; i++) {
        if (data[i].mapCtptIntLat > max_Lat || data[i].mapCtptIntLat < min_Lat) {
            delete data[i];
            continue;
        }
        if (data[i].mapCtptIntLot > max_Lot || data[i].mapCtptIntLot < min_Lot) {
            delete data[i];
            continue;
        }
    }
    
    // null값 삭제
    data = data.filter((element, i) => element != null);

    return data;
};

const delEmptyData = (data) => {

    for (var i = 0; i < data.length; i++){
        var count = 0;
        for (var key in data[i]) {
            if (data[i].hasOwnProperty(key)) {
                if (key.includes("Cs")) {
                    count++;
                }
            }
        }
        if (count == 0) {
            delete data[i];
        }
    }
    data = data.filter((element, i) => element != null);
    return data;
}


const updateData = () => {

    var result_merge = [];
    result_merge = mergeData();

    result_merge = removeData(result_merge);

    result_merge = getPdsgData(result_merge);

    // 중복값 제거
    result_merge = dedupeData(result_merge);
    result_merge = dedupeData(result_merge);
    result_merge = dedupeData(result_merge);
    result_merge = delEmptyData(result_merge);
    result_merge = correctPos(result_merge);

    result_merge.sort(function(a,b) {
        return parseFloat(a.itstId) - parseFloat(b.itstId);
    });

    resultData = result_merge;
    testData = result_merge;
};

// const reduceTimer = setInterval(() => {
//     var data = [];
//     data = resultData;
//     for (var i = 0; i < data.length; i++) {
//         for (var key in data[i]) {
//             if (data[i].hasOwnProperty(key)) {
//                 if (key.includes("Cs")) {
//                     if(data[i][key] > 10){
//                         data[i][key] = data[i][key] - 10;
//                     } else {
//                         data[i][key] = 0;
//                     }
//                 }
//             }
//         }
//     }
//     resultData = data;
// }, 1000);

const testReduceTimer = setInterval(() => {
    var data = [];
    data = testData;
    // data = resultData;
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (data[i].hasOwnProperty(key)) {
                if (key.includes("Cs") && !key.includes("Max")) {
                    if(data[i][key] > 10){
                        data[i][key] = data[i][key] - 10;
                    } else {
                        data[i][key] = 0;
                        if (data[i][key.substr(0, 6)+"StatNm"] == "stop-And-Remain") {
                            data[i][key.substr(0, 6)+"StatNm"] = "protected-Movement-Allowed";
                            for (var j = 0; j < maxTime.length; j++) {
                                if (data[i].itstId == maxTime[j].itstId) {
                                    data[i][key] = maxTime[j]["protectedMaxAllowed"+key];
                                    break;
                                }
                            }
                        }
                        else if (data[i][key.substr(0, 6)+"StatNm"] == "protected-Movement-Allowed" ||
                                 data[i][key.substr(0, 6)+"StatNm"] == "permissive-Movement-Allowed") {
                            data[i][key.substr(0, 6)+"StatNm"] = "stop-And-Remain";
                            for (var j = 0; j < maxTime.length; j++) {
                                if (data[i].itstId == maxTime[j].itstId) {
                                    data[i][key] = maxTime[j]["MaxStop"+key];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    testData = data;
    // resultData = data;
}, 1000);

const getResult = () => {
    return resultData;
};

const getTestData = () => {
    return testData;
};

const createTestData = () => {
// 출발 : 을지로입구역 3번출구 : 37.56650983, 126.98293728
// 도착 : 종로3가역 10번출구 : 37.57059286, 126.99235298
// ID: 1835, 21835, 1819, 1820, 1620, 1850, 21850, 1863
    var startLat = 37.56650983;
    var startLot = 126.98293728;
    var endLat = 37.57059286;
    var endLot = 126.99235298;
    var Id = ['1835', '21835', '1819', '1820', '1620', '1850', '21850', '1863'];
    var data = [];
    data = JSON.parse(JSON.stringify(testData));

    // itstId가 Id에 해당하는 데이터만 추출
    data = data.filter((element, i) => Id.includes(element.itstId));

    // console.log(data);
    testMockData = data;

    return testMockData;
};

module.exports = {
    setStateData,
    getStateData,
    setTimeData,
    getTimeData,
    setLocationData,
    getLocationData,
    updateData,
    getResult,
    createBoundData,
    createSurroundingData,
    // reduceTimer,
    testReduceTimer,
    getTestData,
    createTestData,
};
